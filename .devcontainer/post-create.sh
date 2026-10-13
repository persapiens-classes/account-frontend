#!/usr/bin/env bash

set -e

# Verify if it's necessary to use sudo (if the user is not root)
SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  SUDO="sudo"
fi

# 1. install chromium and xvfb for cypress
$SUDO apt-get update
$SUDO apt-get install -y chromium xvfb

# 2. configure pnpm store and cypress cache directories
# Usa o valor vindo do devcontainer.json / deploy.yml, com fallback caso rode isolado
$SUDO mkdir -p \
  "${PNPM_CONFIG_STORE_DIR:-/pnpm_data/pnpm_store}" \
  "${PNPM_CONFIG_CACHE_DIR:-/pnpm_data/pnpm_cache}" \
  "${PNPM_CONFIG_STATE_DIR:-/pnpm_data/pnpm_state}" \
  "${CYPRESS_CACHE_FOLDER:-/pnpm_data/cypress_cache}"
# set permissions for default user
if [ "$(id -u)" -ne 0 ]; then
  $SUDO chown -R ${USER}:${USER} /pnpm_data
fi

# 3. install pnpm
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

export PNPM_HOME="${HOME}/.local/share/pnpm"
export PATH="$PNPM_HOME/bin:$PATH"

# 4. install dependencies
if [ "$CI" = "true" ]; then
  pnpm install --frozen-lockfile
else
  pnpm install
fi

# 5. install cypress
pnpm cypress install
