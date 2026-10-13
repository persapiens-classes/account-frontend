#!/usr/bin/env bash

set -e

# install chromium
sudo apt-get update
sudo apt-get install -y chromium

# install pnpm
wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
# configure pnpm store and cypress cache directories
sudo mkdir -p /pnpm_data/pnpm_store /pnpm_data/pnpm_cache /pnpm_data/pnpm_state /pnpm_data/cypress_cache
# set permissions for vscode user
sudo chown -R ${USER}:${USER} /pnpm_data

export PNPM_HOME='/home/vscode/.local/share/pnpm'
export PATH="$PNPM_HOME/bin:$PATH"
# install dependencies
pnpm install
# install cypress
pnpm cypress install
