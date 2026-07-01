---
name: legroom-feedback
description: Draft copy-safe first-alpha feedback for Legroom from local diagnostics. Use when the user runs /legroom-feedback or asks to send Legroom alpha feedback.
allowed-tools: Bash
---

<!-- legroom-managed: feedback-skill-v1 -->

# Legroom Feedback

Draft a short Slack-ready feedback message for the Legroom alpha.

## Inputs

Treat any text after `/legroom-feedback` as the user's initial issue summary.
If it is empty, ask for one sentence about what happened. Ask at most two
follow-up questions before drafting.

## Gather Safe Details

Run these command forms and use their output to fill the form. Continue if a
command fails, and include the failure state without raw shell environment.

```bash
date '+%Y-%m-%d'
legroom --version
claude --version
uname -srm
legroom status
legroom doctor 2>&1 || true
```

If `legroom doctor` reports failures, keep its output; doctor findings are
expected to identify setup, auth, TLS, proxy, or model-discovery problems.

Do not include environment variable values, raw prompts, raw transcripts,
source code, API tokens, full command output from unrelated commands,
screenshots, or full URLs containing embedded credentials.

## Draft

Produce one copyable Slack message in Markdown. Fill as many fields as possible
from command output and the user's request.

````markdown
Legroom alpha feedback
Date: <local date>
Legroom version: <legroom --version>
Claude Code version: <claude --version or unavailable>
Platform: <uname -srm>
Category: <install/setup | enterprise TLS/auth | Claude Code model discovery | proxy/runtime failure | model quality | latency | cost/token confusion | documentation | other>
Selected model alias: <from status/doctor or unknown>
Setup elapsed time: <if user supplied, else unknown>
Expected aliases appeared in Claude Code: <yes/no/unknown>
Could complete real work through Legroom: <yes/no/partial/unknown>

Summary:
<1-3 sentences>

First failing step:
<if any, else none reported>

Expected:
<short>

Actual:
<short>

Model usefulness:
<if user supplied, else not evaluated yet>

Copy-safe diagnostics:
```text
<legroom status output>
<legroom doctor output>
```

Safety check: no raw prompts, transcripts, source, secrets, API tokens, or credential-bearing URLs included.
````

Before presenting the draft, remove any raw prompt, transcript, source, secret,
API token, or credential-bearing URL if the user included it. Replace removed
content with `[redacted by legroom-feedback]`.
