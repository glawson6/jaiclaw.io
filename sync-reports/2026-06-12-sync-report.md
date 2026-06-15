# JaiClaw.io Sync Report — 2026-06-12

**Framework source:** [github.com/glawson6/jaiclaw](https://github.com/glawson6/jaiclaw)
**New framework HEAD:** `2fc4f4c5` — *added ascii-render tool and updated diagrams* (2026-06-12)
**Previous processed HEAD:** `11694daf` (2026-06-10, 0.8.1-SNAPSHOT)
**Mode:** Propose-only — no website files were modified.

---

## 1. Commits that triggered this run

One new commit since the last run:

- `2fc4f4c5` — *added ascii-render tool and updated diagrams* (2026-06-12) — [view](https://github.com/glawson6/jaiclaw/commit/2fc4f4c574ecfe81eed47bbe34f347eb89eae31d)

---

## 2. Stale facts to fix

**None.** The framework README still markets **"38+ Built-in Tools"** and **"53 Tools"** via MCP, and both numbers are unchanged in the README at this HEAD. The site's matching values (`features-data.js` tools card "38+", MCP card "53 Tools"; HomeView "38+ Tools" stat) therefore remain consistent. The new `ascii-render` tool nudges the true count up by one, but since the framework's own copy keeps the `38+`/`53` figures, no site edit is required for accuracy.

The "updated diagrams" portion of the commit refers to framework architecture diagrams (docs/dev), which the website does not embed. No marketing impact.

---

## 3. Missing feature worth surfacing (low priority, optional)

- **`ascii-render` tool** — a new built-in tool that renders ASCII diagrams/boxes (also now exposed via the MCP tool suite). If you want the tools card to feel current, you could add one highlight to the `tools` feature in `src/config/features-data.js` (highlights array, after line 51):

  ```js
  { label: 'ASCII Render', detail: 'Generate ASCII diagrams and boxes inline' },
  ```

  Purely cosmetic — skip if you'd rather keep the highlight list to the six headline categories.

---

## 4. Prior report items — status

The full set of high-priority items flagged in the 2026-06-11 baseline has been **applied** to the site since the last run. Confirmed resolved:

- Channel count → now **11** everywhere (HomeView card, stat, hero).
- Maven module count → now **65+** (hero + stat), matching the README.
- Maven snippet → now uses `jaiclaw-bom` 0.8.0 + `jaiclaw-spring-boot-starter`.
- Examples → now **40**, with new **Pipelines** and **Business Workflows** categories.
- Medium-priority feature cards added: `pipelines`, `camel`, `i18n`, `observability`, `api-stability`, `canvas`, `oauth-rotation`.
- Strategic pages added: `/why`, `/enterprise`, `/resources` routes now exist.

Nothing from the baseline remains open.

---

## 5. Automation notes

- **Email delivery still not possible.** The connected Yahoo Mail connector is read/organize only (no send/compose tool). This report was written to the repo only; an emailed digest requires a send-capable email connector.
- **New baseline SHA recorded:** `2fc4f4c574ecfe81eed47bbe34f347eb89eae31d`.
