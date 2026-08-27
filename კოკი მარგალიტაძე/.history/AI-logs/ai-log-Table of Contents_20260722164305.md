cd /path/to/your/project
cat > ai-log.md << 'EOF'
# AI Usage Log

This log is split across 5 files by day, one per major development phase.

- [Day 1 — Auth setup](AI-logs/ai-log-day-1.md)
- [Day 2 — Clients core](AI-logs/ai-log-day-2.md)
- [Day 3 — CRUD](AI-logs/ai-log-day-3.md)
- [Day 4 — Full features](AI-logs/ai-log-day-4.md)
- [Day 5 — Profile & polish](AI-logs/ai-log-day-5.md)

Each file documents prompts used, AI outputs, what was kept/changed/rejected, and lessons learned throughout the project.
EOF

git add ai-log.md
git commit -m "add root ai-log.md index pointing to daily logs"
git push