#!/usr/bin/env bash
#
# Vercel "Ignored Build Step" (wired up in vercel.json → ignoreCommand).
# Vercel runs it from the project root, i.e. this iem-website/ folder.
#
#   exit 0 → skip: the deployment is cancelled before it builds
#   exit 1 → build as normal
#
# Why it exists: Hobby caps Deployment Storage at 10 GB per team, and every
# deployment Vercel keeps stores its own full copy of public/ (~250 MB of
# notes). Thirty-odd pushes a month fill the cap on their own. A cancelled
# deployment produces no output, so it costs no storage.
#
# Two kinds of deployment are skipped:
#   1. Previews. Changes go straight to main; previews only come from bot
#      branches, and each one would park another ~250 MB copy.
#   2. Production pushes that touched nothing under iem-website/ — the repo
#      also holds the LaTeX question papers and build scripts.
#
# To force a build that this skips: Deployments → ⋯ → Redeploy, and untick
# "Use project's Ignore Build Step".

if [ "$VERCEL_ENV" != "production" ]; then
  echo "Skipping $VERCEL_ENV deployment of ${VERCEL_GIT_COMMIT_REF:-this branch}: only production is built."
  exit 0
fi

prev="$VERCEL_GIT_PREVIOUS_SHA"
if [ -z "$prev" ] || ! git cat-file -e "${prev}^{commit}" 2>/dev/null; then
  # First deployment, or the last deployed commit is outside the shallow
  # clone: nothing to compare against, so build to be safe.
  echo "No previous deployment to compare against; building."
  exit 1
fi

if git diff --quiet "$prev" HEAD -- .; then
  echo "Nothing under iem-website/ changed since ${prev:0:7}; skipping the build."
  exit 0
fi

echo "iem-website/ changed since ${prev:0:7}; building."
exit 1
