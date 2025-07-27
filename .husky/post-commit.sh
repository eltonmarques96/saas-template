#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "📦 Rodando release-it após commit..."

# Gera changelog e atualiza versionamento sem dar push e sem novo commit
npx release-it --ci --no-git.requireCleanWorkingDir

# Adiciona as alterações feitas (CHANGELOG, package.json, etc.)
git add CHANGELOG.md package.json package-lock.json 2>/dev/null || true
git add yarn.lock 2>/dev/null || true

# Emenda as alterações no último commit
git commit --amend --no-edit
