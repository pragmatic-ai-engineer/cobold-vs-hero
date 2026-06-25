# Research Questions

## Context
This research targets the mechanics of skill and command registration in Claude Code. We are investigating how Claude resolves instructions from local files and how these instructions can be influenced by changes in the filesystem.

## Questions
1. How does Claude Code detect and register new slash commands from the `.claude/commands/` directory?
2. What are the specific file formats and metadata required for a markdown file to be recognized as a valid slash command or agent?
3. In what order does Claude Code prioritize instructions from global settings, local `.claude/` files, and provided `SKILL.md` files?
4. How does the `install-command-kit.mjs` script in the `qrspi-demo` repository distribute assets into a target project?
5. Are there any built-in security checks or signature verifications for local skill and command definitions?
