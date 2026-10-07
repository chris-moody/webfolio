# 0005. The resume has a single public revision

- Status: Accepted
- Date: 2026-10-06

## Context

The repo is public. Earlier resume versions, including dates, wording, and contact details, shouldn't be recoverable from git history.

## Decision

1. **One-time purge (done 2026-10-06).** `git filter-repo --invert-paths` removed `src/components/wizard/components/resumeRenderer/` and `public/cmoodyResume.pdf` from every commit. A backup bundle was written outside the repo first.
2. **Single source.** Resume content lives only in `src/content/resume/` as typed data. The page renders from it, and the PDF is generated from it at build time. Neither is hand-maintained.
3. **Resume-only commits.** A commit that touches `src/content/resume/` touches nothing else. Use a neutral message such as "Resume", since the squash keeps the first commit's message.
4. **Squash after every change.** `yarn resume:squash` rewrites the first resume commit to hold the current content and drops later resume commits, then you force-push. Merges are preserved.
5. **Enforced in CI.** `yarn check:resume-history` fails if more than one commit touches the directory, if a resume commit touches other files, or if the purged paths reappear.

## Consequences

- Every resume change rewrites history from the first resume commit onward and needs a force-push. Other clones must re-clone or hard-reset.
- GitHub may keep unreferenced commits reachable by SHA for a while, and forks and old clones keep their own copies. The purge reduces exposure; it doesn't guarantee erasure. GitHub Support can run garbage collection on request.
