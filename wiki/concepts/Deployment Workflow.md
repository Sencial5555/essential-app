---
type: concept
name: "Deployment Workflow"
tags: [deployment, github, vercel, git, workflow]
sources: ["Basic Phrases", "Direct Step-by-Step", "Using Obsidian for the Project", "Beginner Step-by-Step"]
---

## Definition
The automated pipeline that takes local code changes live to the internet: Claude Code commits to Git → push to GitHub → Vercel detects the push → deploys in under 10 seconds.

## The Loop
```
[Claude Code writes code]
        │
        ▼
[Git commit + push to GitHub]
        │
        ▼
[Vercel detects push → auto-deploys]
        │
        ▼
[Live URL updates — open on phone]
```

## When to Push to GitHub
1. A feature is complete and tested locally
2. End of each weekend coding session (backup)
3. Before trying a risky experiment (safety checkpoint — can revert if broken)

## Claude Code Command
"Save our current design changes and push them to our GitHub repository." — Claude handles all git commands automatically.

## Related
- [[GitHub]]
- [[Vercel]]
- [[Render]]
- [[Claude Code]]
- [[Build Phases]]
