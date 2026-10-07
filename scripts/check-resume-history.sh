#!/usr/bin/env bash
# Resume content has a single public revision.
#
# Fails when:
#   - more than one commit reachable from HEAD touches the resume directory
#   - a commit touching the resume directory also touches anything else
#   - the purged legacy resume paths reappear in history
#
# CI must check out full history (fetch-depth: 0) for this to be meaningful.
set -euo pipefail

RESUME_DIR="src/content/resume"
LEGACY_PATHS=(
  "src/components/wizard/components/resumeRenderer"
  "public/cmoodyResume.pdf"
)

cd "$(git rev-parse --show-toplevel)"

if [ "$(git rev-parse --is-shallow-repository)" = "true" ]; then
  echo "check-resume-history: shallow clone; fetch full history first (fetch-depth: 0)." >&2
  exit 2
fi

status=0

commits=$(git rev-list HEAD -- "$RESUME_DIR")
count=$(printf '%s' "$commits" | grep -c . || true)
if [ "$count" -gt 1 ]; then
  echo "✘ $count commits touch $RESUME_DIR (max 1). Run: yarn resume:squash" >&2
  git log --oneline HEAD -- "$RESUME_DIR" >&2
  status=1
fi

for commit in $commits; do
  others=$(git show --pretty=format: --name-only -m "$commit" | grep -v "^$RESUME_DIR/" | grep . || true)
  if [ -n "$others" ]; then
    echo "✘ $(git log -1 --format='%h %s' "$commit") touches files outside $RESUME_DIR:" >&2
    printf '    %s\n' $others >&2
    status=1
  fi
done

for path in "${LEGACY_PATHS[@]}"; do
  if [ -n "$(git rev-list --all -- "$path" | head -1)" ]; then
    echo "✘ purged legacy path is back in history: $path" >&2
    status=1
  fi
done

[ "$status" -eq 0 ] && echo "✔ resume history: $count commit(s) touch $RESUME_DIR; no legacy paths."
exit "$status"
