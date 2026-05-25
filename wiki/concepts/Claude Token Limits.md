---
type: concept
name: "Claude Token Limits"
tags: [claude, workflow, context, limits, strategy]
sources: ["Claude Limit Hit", "Cheat Code for Claude", "The Need for the Project", "How to Use Claude"]
---

## Definition
The problem where Claude re-reads its entire conversation history on every message, causing long threads to rapidly exhaust the daily usage limit. At message #30, Claude may be processing ~25,000 words per prompt.

## Why It Happens
Every message sends the full context window back to Claude. Message 1 = 500 words. Message 30 = 25,000 words. A few prompts in a long thread can burn the 5-hour usage limit.

## Four Workarounds

### 1. Claude Projects (Best for ongoing work)
Pin CLAUDE.md and key files to a Project. Anthropic's prompt caching freezes them — re-reading costs a fraction of normal tokens. See [[Prompt Caching]].

### 2. Fresh Chat Rule
When a piece of code works perfectly, start a brand new chat. Paste the working code + "this works, now add the next feature." Keeps threads short and cheap.

### 3. Bulk Debugging
Instead of one message per error, bundle all errors into one detailed prompt: "Here is the error code, here is what happened on screen, here is what I clicked. Fix all three at once."

### 4. Usage Credits
Load $10–$20 in Anthropic credits as insurance. When subscription limit hits, seamlessly continues at a few cents per message — keeps momentum on a productive session.

## [[Karpathy LLM Wiki]] Solution
Wiki indexes let [[Claude Code]] follow links to specific files rather than re-reading the entire codebase. A developer compressed 383 files into wiki style and cut Claude token usage by 95%.

## Related
- [[Prompt Caching]]
- [[Fresh Chat Rule]]
- [[Claude Code]]
- [[Karpathy LLM Wiki]]
- [[Build Phases]]
