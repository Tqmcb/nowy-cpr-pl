#!/bin/bash
# Remote Claude Code session via tmux
# Usage: ssh admin@<tailscale-ip> -t "bash ~/Downloads/nowy-cpr-pl/.claude/scripts/remote-claude.sh"
#
# From phone: use Termius, Blink Shell, or a]Shell app
# Connect via SSH to your Mac's Tailscale IP

SESSION_NAME="claude-cpr"
PROJECT_DIR="$HOME/Downloads/nowy-cpr-pl"

# If session exists, attach to it
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo "Attaching to existing Claude Code session..."
    tmux attach-session -t "$SESSION_NAME"
else
    echo "Starting new Claude Code session..."
    tmux new-session -d -s "$SESSION_NAME" -c "$PROJECT_DIR"
    tmux send-keys -t "$SESSION_NAME" "cd $PROJECT_DIR && claude" Enter
    tmux attach-session -t "$SESSION_NAME"
fi
