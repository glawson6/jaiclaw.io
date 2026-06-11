# JaiClaw.io Sync Report — 2026-06-11

**Framework source:** [github.com/glawson6/jaiclaw](https://github.com/glawson6/jaiclaw)
**Framework HEAD:** `11694daf` — *chore: bump version to 0.8.1-SNAPSHOT* (2026-06-10)
**Latest release:** 0.8.0 (2026-06-10)
**Mode:** Propose-only — no website files were modified. Apply the edits below manually.

This is the baseline (first) run. It compares the entire framework against the
current site. Subsequent daily runs will only report what changed since the last
processed commit.

---

## 1. Stale facts to fix (high priority)

These are places where the website states something the framework has moved past.

### 1.1 Channel count: site says **7**, framework now ships **11**

The framework README and POSITIONING doc both advertise **11 first-party channel
adapters**. The site still says 7 everywhere.

Framework channels: Telegram, Slack, Discord, Email, SMS, Signal, Teams, **WhatsApp,
Google Chat, LINE, Matrix** (POSITIONING also counts WebSocket). The four bolded are
missing from the site.

Files to update:

- `src/views/HomeView.jsx`
  - `homeFeatures` card: `'7 Channels'` → `'11 Channels'`, and extend the description list.
  - Stats bar: `<StatCounter value="7" label="Channels" />` → `"11"`.
  - Hero description: "Telegram, Slack, Discord, Email, SMS, Signal, or Teams" — add the new channels or change to "11 messaging channels."
- `src/config/features-data.js` — the `channels` feature `description` says "any messaging platform" but only lists 7 highlights. Add WhatsApp, Google Chat, LINE, Matrix.

### 1.2 Maven module count: site says **136**, README says **65+**

`HomeView.jsx` hero ("Production-ready framework with 136 Maven modules") and the
stats bar both show **136**. The framework README states **"composed of 65+ Maven
modules."** One of these is wrong — most likely the site. Confirm the real number
(`find . -name pom.xml | wc -l` in the framework) and align both. If 136 counts
generated/test modules, use the README's public-facing 65+ figure instead.

### 1.3 Maven quick-start snippet is wrong (HomeView)

`src/views/HomeView.jsx` `MAVEN_SNIPPET` currently reads:

```xml
<dependency>
    <groupId>io.jaiclaw</groupId>
    <artifactId>jaiclaw-starter</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</dependency>
```

Three problems vs. the framework README:
- Artifact is **`jaiclaw-spring-boot-starter`**, not `jaiclaw-starter`.
- Version `1.0.0-SNAPSHOT` is not a real published version. Maven Central has **0.7.0**; the current release is **0.8.0**.
- The README pattern imports the **`jaiclaw-bom`** for dependency management. The snippet should match.

Suggested replacement (mirrors the README):

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.jaiclaw</groupId>
      <artifactId>jaiclaw-bom</artifactId>
      <version>0.8.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <dependency>
    <groupId>io.jaiclaw</groupId>
    <artifactId>jaiclaw-spring-boot-starter</artifactId>
  </dependency>
</dependencies>
```

> Note: verify the BOM version actually published to Maven Central before shipping —
> the README body still references 0.7.0 as the "verified live" version even though
> 0.8.0 is tagged.

### 1.4 Examples: site lists **28**, README advertises **40**

`src/config/examples-data.js` has 28 entries across 8 categories. The framework README
lists **40 example applications** and two categories the site is missing entirely:

- **Pipelines (declarative multi-stage workflows)** — new capability area. Examples:
  `pipeline-e2e`, `support-triage-pipeline`, `invoice-processor`,
  `aiops-incident-responder`, `competitive-intel-briefing`, `sales-enrichment-pipeline`,
  `contract-reviewer` (plus `content-pipeline` and `data-pipeline`, already listed).
- **Business workflows** — `support-triage`, `procurement-approval`, `tax-advisor`,
  `onboarding-intake` (plus `helpdesk-bot`, already listed).
- **Getting started** — `hello-world` (the "~30 LOC" minimal app the README leads with).

Action: add a `Pipelines` and a `Business Workflows` category to `categories[]`, and add
the missing example objects to `examples[]`.

---

## 2. Missing features worth surfacing (medium priority)

New framework capabilities that have no dedicated presence on the site. Candidates for
`features-data.js` cards or new page sections.

- **Pipelines** — declarative multi-stage workflows (classify → route → respond, ETL with
  human-in-the-loop, etc.). Currently only implied through examples; deserves a feature card.
- **Apache Camel integration** — five Camel examples exist on the site, but there is no
  feature card explaining the Camel route → JaiClaw agent integration.
- **Internationalization** — POSITIONING cites **10 locales** built in. Not mentioned anywhere.
- **Production deployment & observability** — new `docs/user/PRODUCTION-DEPLOYMENT.md` covers
  K8s manifests, Helm, Actuator/Micrometer metrics (`jaiclaw.agent.invocations`,
  `jaiclaw.tool.calls`, `jaiclaw.tokens.usage`, `jaiclaw.sessions.active`), Prometheus
  scrape config, health probes, resource sizing. Strong enterprise selling point — nothing
  on the site reflects it.
- **API stability program / Road to 1.0** — new `docs/ROAD-TO-1.0.md` + `@Stable`/`@Experimental`/
  `@Internal` markers signal production maturity. A roadmap/stability note builds buyer trust.
- **Canvas / A2UI live dashboards** — appears in examples but has no feature card despite being
  a headline "hidden superpower" in the README.
- **OAuth credential rotation** — round-robin across multiple API keys with cooldown tracking;
  auto-syncs tokens from Claude CLI / Codex CLI. Not represented.

---

## 3. Suggested new pages / larger additions (strategic)

- **"Why JaiClaw" comparison page** — the new `docs/POSITIONING.md` is effectively pre-written
  marketing copy: JaiClaw vs Spring AI alone, LangChain4j, Embabel-alone, and roll-your-own,
  plus the five differentiators (GOAP planning, multi-tenant isolation, MCP server hosting,
  11 channel adapters, built-in billing) and an honest "when to choose something else" section.
  This maps cleanly to a `/why` or `/compare` route.
- **Production / Enterprise page** — built from `PRODUCTION-DEPLOYMENT.md` and the multi-tenancy
  architecture doc; targets the enterprise buyer the current site under-serves.
- **Whitepaper refresh** — the project brief mentions whitepapers, but none were found in the
  site repo. The 0.8.0 release notes, POSITIONING, and ROAD-TO-1.0 are enough raw material to
  draft a "JaiClaw 0.8: production-grade Java agents" whitepaper. Flag if you want this drafted.

---

## 4. Confirmed accurate (no change needed)

LLM providers (11), built-in tools (38+), bundled skills (59), plugin hooks (14),
MCP tool count (53), GOAP/Embabel, multi-tenancy, security hardening, voice/telephony,
compaction, subscription billing — all match the framework.

---

## 5. Notes for automation

- **Email delivery is not yet possible.** The connected Yahoo Mail connector is read/organize
  only (no send/compose tool). To get the emailed digest you chose, connect a send-capable
  email connector (e.g., Gmail with send scope, or an SMTP/Zapier action). Until then, the
  daily run will write this report into `sync-reports/` only.
- **Baseline commit recorded:** `11694daf0de265c378b7ae8d2759caa3c43ed10d`. The daily task
  stores the last-processed SHA in `sync-reports/.last-sha` and only reports commits newer
  than it.
