# Working conventions for this repo

This file is read automatically by Claude Code at the start of every
session in this repo — on any machine, after any reboot. It exists so
conventions this project already follows don't have to be
re-discovered (or re-broken) each time a new session picks up the work.

## Commit messages

- Imperative, present tense, no trailing period: "Add X", "Fix Y",
  "Recolor Z".
- Use a `type:` prefix only for these specific kinds of change, matching
  the existing history — everything else is a plain sentence, no prefix:
  - `chore: gitignore <path>` — gitignore-only changes (see `54069c7`,
    `e4edcf9`)
  - `fix: ...` — bug fixes
  - `feat: ...` — new user-facing functionality
  - `refactor: ...` — code reorganized, behavior unchanged
  - `style: ...` — visual/CSS-only changes
  - `docs: ...` — README.md, ai-log.md, glossary.md, research-note.md
- Commit only the paths that belong to the change:
  `git commit <files> -m "..."`, never `git add -A` / `git commit -a`.
  This repo deliberately leaves personal scratch files (worklog.md,
  Scheduled/, slides/, .claude/ — see .gitignore) sitting
  staged-but-uncommitted sometimes; a blanket add sweeps them into an
  unrelated commit.
- Never rewrite a commit that's already been pushed (`commit --amend` +
  `push --force`) without asking first, even to fix a message — `main`
  is the exam submission branch.

## ai-log.md is a living document, not a one-time deliverable

The exam PRD's "AI usage" module requires `ai-log.md` to document real
AI-assisted work across every stage of the project — not just what was
true at the initial hand-in. Whenever an AI session makes a nontrivial
code or behavior change, add a row to the Summary table (and a
Highlights entry if there's a non-obvious lesson) as part of that same
session, before moving on — not saved up for later.

## Environment quirk: OneDrive + git

This repo lives inside a OneDrive-synced folder. OneDrive's file lock
occasionally makes git fail to append to a reflog file, with:
`unable to append to '.git/logs/...': Invalid argument`
The fix is a one-off flag on that single command —
`git -c core.logAllRefUpdates=false <command>` — not a permanent
change. Never run `git config windows.appendAtomically false` or any
other `git config` write; if the one-off flag doesn't clear it, stop
and ask rather than reaching for a config change.

## Verify UI behavior in an actual browser before touching code

Don't fix (or dismiss) a reported UI bug from reading the code alone —
this repo has a real precedent (`994d9c6`, the auth guard only broke on
servers with "clean URLs", which no code review caught). Drive the page
with headless Chromium (Playwright) and seed `localStorage`
(`crm_users` / `crm_session`) directly instead of clicking through
signup/login each time. No build step — serve the folder statically
(`npx serve .`, see `.claude/launch.json`) or open the HTML file
directly; both work since everything is vanilla JS.
