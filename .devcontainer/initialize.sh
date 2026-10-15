#!/usr/bin/env bash

set -e

# Target path for the static Xauthority file in the host user's home directory
TARGET_XAUTH="${HOME}/.xauth_devcontainer"

# Check if XAUTHORITY is set and points to an existing file (local Linux GUI session)
if [ -n "${XAUTHORITY:-}" ] && [ -f "$XAUTHORITY" ]; then
  # Copy active dynamic X11 credentials to the persistent static file
  cp "$XAUTHORITY" "$TARGET_XAUTH"
else
  # Fallback for headless environments (like GitHub Codespaces) or Wayland-only sessions
  touch "$TARGET_XAUTH"
fi
