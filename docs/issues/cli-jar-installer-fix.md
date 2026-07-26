# Issue: `curl … | bash` installer produces a corrupt CLI jar

**Status:** Proposed (not applied — design only)
**Reporter:** Greg Lawson (observed 2026-06-18)
**Severity:** High — silently breaks the documented one-line install path on the marketing site.
**Symptom:** Running `curl -fsSL https://jaiclaw.io/install.sh | bash` reports success,
but the first `jaiclaw …` command fails with:

```
Error: Invalid or corrupt jarfile /Users/tap/.jaiclaw/bin/jaiclaw-cli.jar
```

---

## 1. Root cause

`public/install.sh` (line 173) builds the CLI download URL as:

```bash
local url="https://github.com/$JAICLAW_REPO/releases/download/v${JAICLAW_VERSION}/jaiclaw-cli-${JAICLAW_VERSION}.jar"
```

With the hardcoded default `JAICLAW_VERSION="${JAICLAW_VERSION:-0.7.1-SNAPSHOT}"` (line 21),
the resolved URL is:

```
https://github.com/glawson6/jaiclaw/releases/download/v0.7.1-SNAPSHOT/jaiclaw-cli-0.7.1-SNAPSHOT.jar
```

Two compounding problems:

1. **No matching GitHub release exists.** `glawson6/jaiclaw` has zero releases on GitHub
   today — verified via `curl https://api.github.com/repos/glawson6/jaiclaw/releases` and
   `…/releases/latest`, both empty. The URL above returns `HTTP/2 404`. This is true for
   any `JAICLAW_VERSION` value — `0.7.1-SNAPSHOT`, `0.8.0`, `0.9.0` — none exist as
   GitHub release assets.
2. **`curl -sSL` is used without `-f`.** When the URL 404s, curl writes the HTML 404 body
   into `$JAICLAW_HOME/bin/jaiclaw-cli.jar` and exits 0. The script reports
   `✓ Downloaded CLI JAR` and continues. The "jar" is HTML; Java rejects it as soon as
   the user runs `jaiclaw`.

The lower-priority but real third issue: **`JAICLAW_VERSION` is stale.** The framework is
at 0.9.0 (0.8.1-SNAPSHOT bumped); the installer still defaults to a pre-0.8 snapshot. Even
once a release exists, the version pin will be wrong.

### Maven Central is not a workaround

The framework BOM and CLI artifact `io.jaiclaw:jaiclaw-cli:0.9.0` ARE published on Maven
Central. **However**, only the **thin** (library) jar was uploaded:

| Artifact | Size | `Main-Class` | Bootable? |
|---|---|---|---|
| Maven Central `jaiclaw-cli-0.9.0.jar` | 19 KB | none | **No** |
| Local `apps/jaiclaw-cli/target/jaiclaw-cli-0.9.1-SNAPSHOT.jar` | 75 MB | `JarLauncher` (Spring Boot fat jar) | Yes |

Pointing the installer at the Central URL replaces "Invalid or corrupt jarfile" with
"no main manifest attribute in jar". Same broken outcome.

The Spring Boot Maven plugin's `repackage` goal is replacing the install target with
the fat jar locally, but the publish step is uploading the original thin jar to Central
(missing the `<classifier>exec</classifier>` config or equivalent). Fixing this is a
framework-side change, not a site change.

---

## 2. Proposed fix (Option B — host the jar on jaiclaw.io)

Five file-level changes in the jaiclaw.io repo. **None applied yet.** This is the design
proposal to be reviewed before any commit.

### 2.1 Copy the bootable fat jar into `public/downloads/`

Vite copies `public/**/*` verbatim into the build output (`dist/`), which the Maven
`copy-react-build-to-docker` step (pom.xml:206–222) then bakes into the nginx container.
So dropping the jar into `public/downloads/` is sufficient — no pom or JKube changes.

Source: the local framework build:
`/Users/tap/dev/workspaces/openclaw/jaiclaw/apps/jaiclaw-cli/target/jaiclaw-cli-0.9.1-SNAPSHOT.jar`

Target (rename to a stable, non-SNAPSHOT filename):
`public/downloads/jaiclaw-cli-0.9.0.jar` (75 MB)

The jar boots cleanly when smoke-tested with `java -jar` — banner appears, Spring context
loads, 38 skills register, "Started JaiClawCliApplication in 2.372 seconds".

> **Note**: the local jar Maven version is `0.9.1-SNAPSHOT` even though the framework
> tagged 0.9.0. Renaming to `jaiclaw-cli-0.9.0.jar` on the site is a presentation choice
> — accept the slight white lie, or republish from a 0.9.0 framework checkout. The latter
> is cleaner.

### 2.2 `nginx.conf` — add `/downloads/` location

Append below the existing `/whitepapers/` block (around line 51):

```nginx
    # Downloads (CLI jar, etc.) — served as static files with explicit jar MIME
    location /downloads/ {
        types {
            application/java-archive jar;
        }
        default_type application/octet-stream;
        add_header X-Content-Type-Options "nosniff" always;
    }
```

The `types {}` override is important — base nginx doesn't include `.jar` in `mime.types`
on every distro, and a generic `application/octet-stream` would let the browser misguess
based on Content-Disposition.

### 2.3 `deployment/helm/jaiclaw-io/templates/configmap.yaml` — mirror in the helm ConfigMap

The same block, with the deeper indentation that matches the helm ConfigMap nesting,
added right after its own `/whitepapers/` block (around line 73). This is a verbatim
mirror of 2.2 — needed because nginx in the cluster runs from the ConfigMap-mounted
config, not from the baked-in `nginx.conf`.

### 2.4 `public/install.sh` — patch URL + add `-f` + magic-byte check

Three minimal edits:

**Line 21 — bump version:**

```diff
-JAICLAW_VERSION="${JAICLAW_VERSION:-0.7.1-SNAPSHOT}"
+JAICLAW_VERSION="${JAICLAW_VERSION:-0.9.0}"
+JAICLAW_CLI_BASE_URL="${JAICLAW_CLI_BASE_URL:-https://jaiclaw.io/downloads}"
```

Adding the env-driven base URL keeps the script easy to repoint at a CDN, GitHub release,
or local dev mirror without editing.

**Lines 172–181 — replace the download block:**

```bash
    # Download from jaiclaw.io
    local url="${JAICLAW_CLI_BASE_URL}/jaiclaw-cli-${JAICLAW_VERSION}.jar"
    local dest="$JAICLAW_HOME/bin/jaiclaw-cli.jar"
    info "Downloading CLI JAR from ${url}"
    # -f: fail on HTTP errors instead of writing the error body into the jar.
    if ! curl -fsSL -o "$dest" "$url"; then
        rm -f "$dest"
        err "Failed to download CLI JAR from $url"
        echo "Build from source: ./mvnw package -pl :jaiclaw-cli -am -DskipTests"
        echo "Then copy to: $dest"
        return 1
    fi

    # Sanity check — every JAR is a ZIP and starts with the magic bytes 'PK\x03\x04'.
    # A 404 HTML page or rate-limit error written into the file would fail this check
    # and trip "Invalid or corrupt jarfile" only later when Java tries to run it.
    if ! head -c4 "$dest" | grep -q $'^PK\x03\x04'; then
        rm -f "$dest"
        err "Downloaded file is not a valid JAR (magic bytes mismatch). Aborting."
        return 1
    fi
    ok "Downloaded CLI JAR ($(wc -c <"$dest" | tr -d ' ') bytes)"
}
```

Changes vs the current script:
- `-f` so curl exits non-zero on HTTP 4xx/5xx instead of writing the error body.
- Cleanup with `rm -f "$dest"` on any failure — the script otherwise leaves a half-broken
  jar that the next install run might mistake for a successful download.
- Magic-byte check via `head -c4 | grep`. JAR is a ZIP archive; ZIP starts with
  `PK\x03\x04`. Any successful HTTP response that isn't a real archive will fail this
  test (HTML, JSON error envelope, gzip-encoded content with a misconfigured server,
  rate-limit page, etc.).
- The function now propagates failure via `return 1` instead of `warn`-ing and continuing.

### 2.5 Canonical `install.sh` lives upstream — keep in sync

`public/install.sh` is a copy of `install.sh` at the root of the jaiclaw framework repo
(noted at the top of the script: *"This is a copy of the canonical script. Update from
the jaiclaw repo when the installer changes."*). Patching the site copy fixes the
`curl … | bash` path for jaiclaw.io users, but the framework's own copy is still broken.

**Two-repo follow-up:** apply the same edits to `glawson6/jaiclaw:install.sh`. Users
running `curl … raw.githubusercontent.com/.../install.sh | bash` will continue to fail
until both are patched. Recommended: patch both in lockstep, mention which canonical
source wins in the script comment.

---

## 3. Verification plan (when applied)

1. **Build smoke-test (local):**
   ```
   ./mvnw clean package k8s:build k8s:push -Pprod,docker
   ```
   Should succeed and produce `dist/downloads/jaiclaw-cli-0.9.0.jar` (~75 MB) as part of
   the Vite build, then bake it into the Docker image.

2. **Deploy** with the standard 4-step procedure (see
   `~/.claude/projects/.../memory/deploy-prod-procedure.md`):
   - `docker push tooling.taptech.net:5000/jaiclaw-io:latest`
   - `./deployment/helm/deploy-prod.sh`
   - `kubectl rollout restart deployment jaiclaw-io-prod`

3. **HTTP sanity check:**
   ```
   curl -I https://jaiclaw.io/downloads/jaiclaw-cli-0.9.0.jar
   # Expected: HTTP/2 200, Content-Type: application/java-archive, Content-Length: ~78700000
   ```

4. **End-to-end install in a clean directory:**
   ```
   rm -rf ~/.jaiclaw
   curl -fsSL https://jaiclaw.io/install.sh | bash
   ~/.jaiclaw/bin/jaiclaw help
   # Expected: banner + command list, NOT "Invalid or corrupt jarfile"
   ```

5. **Negative-path check** (confirm `-f` and the magic-byte guard work):
   ```
   JAICLAW_CLI_BASE_URL="https://jaiclaw.io/does-not-exist" curl -fsSL https://jaiclaw.io/install.sh | bash
   # Expected: "✗ Failed to download CLI JAR" then exit non-zero, NO corrupt jar left behind
   ```

---

## 4. Alternatives considered and rejected

### A. Republish executable jar to Maven Central

The "right" long-term fix. Requires editing `apps/jaiclaw-cli/pom.xml` in the framework to
configure the Spring Boot Maven plugin to publish an executable classifier (e.g.
`<classifier>exec</classifier>`), then cutting and releasing **0.9.1** (Central is
immutable — 0.9.0 can't be overwritten). Pros: gives library users a single source of
truth; supports `gh release`-style discovery. Cons: requires the framework release
workflow (signing, staging, propagation delay); not deployable today.

### C. GitHub Releases hosting

Cut `v0.9.0` on `glawson6/jaiclaw`, attach the local fat jar via `gh release create`.
Stable URL pattern; installer's existing template (line 173) already matches. Cons:
GitHub Release artifacts are versioned at a different cadence than Maven Central; you
end up maintaining two parallel publishing flows for the same jar. Pros: keeps the
marketing site's Docker image small (we don't ship a 75 MB binary in nginx). **Worth
revisiting if the jar's size becomes an operational concern.**

### Option B (chosen) — host the fat jar on jaiclaw.io itself

Pros: deployable today with one site commit and a deploy; no framework changes; no
external publishing flow; uses existing static-asset infrastructure (the `/whitepapers/`
pattern is already proven). Cons: bloats the Docker image from ~10 MB to ~85 MB; site
becomes the system of record for the executable artifact instead of a CDN.

Tradeoff verdict: image bloat is real but tolerable (one pull-per-deploy, layer cached
after first nginx layer); the alternative options have larger blast radius.

---

## 5. Out of scope for this issue

- The `JAICLAW_CAPTCHA_URL` import error in `src/views/ContactView.jsx` (line 2)
  currently breaks `npm run build`. The view imports a constant that doesn't exist in
  `src/config/constants.js`. This blocks *any* deploy — not just this fix. Track as a
  separate issue.
- The Spring Boot Maven plugin classifier configuration in the framework repo (the
  "Option A" fix). Track as a separate issue in the framework repo, not here.
- The framework's installer (`/Users/tap/dev/workspaces/openclaw/jaiclaw/install.sh`)
  carries the same bug. Apply the same patch upstream — track as a follow-up in the
  framework repo.
- Existing `sync-reports/.last-sha` drift (current local value is `2fc4f4c5…` but
  should be `f2ae0db3…` based on the last commit's sync state). Unrelated to this issue.

---

## 6. Open questions

1. **Filename: `jaiclaw-cli-0.9.0.jar` vs `jaiclaw-cli-latest.jar`?** A pinned-version
   filename means the installer's `JAICLAW_VERSION` controls which jar gets pulled; a
   `-latest.jar` symlink means the version pin becomes purely cosmetic and any newer
   build deployed to the site is automatically picked up. The pinned approach is safer
   (reproducible installs); the latest approach removes one extra commit per version
   bump. Recommendation: pinned for v1; revisit if version churn becomes annoying.
2. **Should the doctor command verify the jar after install?** Today's `DoctorCommand`
   exits cleanly even if the jar can't be loaded. Adding a `java -jar … --version` style
   check inside `install.sh` post-install would catch the failure at install time
   instead of at first use.
3. **Where does this issue file live long-term?** This is the first item in
   `docs/issues/`. Convention: kebab-case filename, one issue per file, status header
   updated as it moves through proposed → applied → closed. Or migrate to GitHub Issues
   once the repo is published.
