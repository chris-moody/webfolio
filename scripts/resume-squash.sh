#!/usr/bin/env bash
# Collapse the resume's history to its current state.
#
# Workflow for any resume change:
#   1. Edit files under src/content/resume/ only.
#   2. Commit them on their own:  git commit -m "Update resume" -- src/content/resume
#   3. Run:                       yarn resume:squash
#   4. Review, then force-push:   git push --force-with-lease origin <branches>
#
# What it does: the FIRST commit that ever touched the resume directory is
# rewritten to contain the resume exactly as it is at HEAD, and every later
# resume-only commit is dropped. Everything else, merges included, is kept.
# Commit SHAs from the first resume commit onward change.
#
# Requires git-filter-repo. A backup bundle is written next to the repo first.
set -euo pipefail

RESUME_DIR="src/content/resume"

cd "$(git rev-parse --show-toplevel)"
repo_root=$(pwd)

die() { echo "resume-squash: $*" >&2; exit 1; }

command -v git-filter-repo >/dev/null || die "git-filter-repo is not installed (brew install git-filter-repo)."
[ -z "$(git status --porcelain)" ] || die "working tree is not clean; commit or stash first."

# shellcheck disable=SC2207 # SHAs never contain whitespace
resume_commits=($(git rev-list --reverse HEAD -- "$RESUME_DIR"))
if [ "${#resume_commits[@]}" -le 1 ]; then
  echo "resume-squash: ${#resume_commits[@]} commit(s) touch $RESUME_DIR; nothing to squash."
  exit 0
fi

first="${resume_commits[0]}"

# Every non-merge resume commit on any branch must be resume-only and descend
# from the first one on HEAD, so dropping the later ones can't lose unrelated
# work. (Merges are kept; they just carry the final resume state.)
for commit in $(git rev-list --all --no-merges -- "$RESUME_DIR"); do
  label=$(git log -1 --format='%h %s' "$commit")
  git merge-base --is-ancestor "$commit" HEAD || die "$label touches $RESUME_DIR but isn't on HEAD. Merge it first."
  git merge-base --is-ancestor "$first" "$commit" || die "$label doesn't descend from the first resume commit."
  others=$(git show --pretty=format: --name-only "$commit" | grep -v "^$RESUME_DIR/" | grep . || true)
  [ -z "$others" ] || die "$label also touches files outside $RESUME_DIR. Split it first."
done

remote_url=$(git remote get-url origin 2>/dev/null || true)
backup="$(dirname "$repo_root")/$(basename "$repo_root")-backup-resume-squash-$(date +%Y%m%d-%H%M%S).bundle"
git bundle create "$backup" --all >/dev/null
echo "resume-squash: backup written to $backup"

# Final state of the resume directory: "mode blob path" per file.
final_tree=$(git ls-tree -r HEAD -- "$RESUME_DIR" | awk -F'\t' '{ split($1, meta, " "); print meta[1] " " meta[3] " " $2 }')
# Paths that ever existed, so the rewritten first commit can delete stale ones.
all_paths=$(git log --all --pretty=format: --name-only -- "$RESUME_DIR" | sort -u | grep . || true)

export RESUME_DIR FIRST_COMMIT="$first" FINAL_TREE="$final_tree" ALL_PATHS="$all_paths"

# A stale marker from an older run makes filter-repo prompt interactively.
rm -f .git/filter-repo/already_ran

git filter-repo --force --commit-callback '
import os
resume_dir = os.environ["RESUME_DIR"].encode() + b"/"
first = os.environ["FIRST_COMMIT"].encode()
in_dir = lambda change: change.filename.startswith(resume_dir)
touches_resume = any(in_dir(change) for change in commit.file_changes)
kept = [change for change in commit.file_changes if not in_dir(change)]
# The first resume commit takes the final content. Merges that brought resume
# changes in carry the final content too, so every branch ends up with only the
# current version. Other resume commits lose their changes and, being
# resume-only, become empty and are pruned.
if commit.original_id == first or (touches_resume and len(commit.parents) > 1):
    final = {}
    for line in os.environ["FINAL_TREE"].splitlines():
        mode, blob, path = line.split(" ", 2)
        final[path.encode()] = (mode.encode(), blob.encode())
    for path, (mode, blob) in final.items():
        kept.append(FileChange(b"M", path, blob, mode))
    for path in os.environ["ALL_PATHS"].splitlines():
        if path.encode() not in final:
            kept.append(FileChange(b"D", path.encode()))
commit.file_changes = kept
'

if [ -n "$remote_url" ] && ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$remote_url"
fi

remaining=$(git rev-list HEAD -- "$RESUME_DIR" | wc -l | tr -d ' ')
echo "resume-squash: done. $remaining commit(s) now touch $RESUME_DIR."
echo "Review with 'git log --stat -- $RESUME_DIR', then force-push the rewritten branches:"
echo "  git fetch origin && git push --force-with-lease origin $(git for-each-ref --format='%(refname:short)' refs/heads | tr '\n' ' ')"
