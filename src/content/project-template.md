---
# Template for a new project: copy this file into src/content/projects/ and rename it, for example
# my-project.md. The file name becomes the address of its page: /work/my-project.
# Lines that start with # are notes. They can stay or go.

title: Project name
# One line for the card and the top of the project page, at most 160 characters.
summary: What it does, in one sentence.
# The full text, shown in More projects.
description: What it does, how it works, and what came out of it.
# shipped, in-progress, or course
status: shipped
# true: a card in Projects and its own page. false: a row in More projects.
featured: false
# Lower comes first. A decimal slots it between two projects, for example 2.5.
order: 22
# The field, which sets the color and the group:
# llm-voice (LLM, RAG and voice), vision-audio (Vision and audio),
# ml-data (Machine learning and data), or software (Software)
domain: ml-data
# Every tool and topic. The card shows the first four.
tags:
  - Python
  - FastAPI

# Optional: remove the # in front of the lines you need.
# period:
#   start: 2025-01 # YYYY-MM
#   end: 2025-06 # YYYY-MM or present; leave out for a single month
# role: AI Engineer
# context: Company or course name
# confidential: true # client work whose code is private
# links:
#   repo: https://github.com/Michs224/...
#   demo: https://...
#   paper: https://...
# keyStack: [Python, FastAPI] # up to four tools for the card, instead of the first four tags
# stack: # tools by group on the project page, instead of the plain tag list
#   Backend: [FastAPI, PostgreSQL]
# cover: ../../assets/work/my-project.webp # a picture at the top of the project page
# coverAlt: What the picture shows, for people who cannot see it
# More extras for the project page: metrics (see vision-qc.md) and pipeline (see voice-agent.md).

# The project page text goes below the closing line, in Markdown: headings (##), lists, links,
# pictures. Without text there, the page shows the description.
---
