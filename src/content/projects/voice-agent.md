---
title: AI Voice Agent (Sales Roleplay)
summary: Real-time voice agent that helps sales representatives practice with an AI customer persona.
description: Real-time voice agent that helps sales representatives practice with an AI customer persona. It uses a cascaded voice pipeline (ASR → LLM → TTS) being built from scratch to enable natural spoken dialogue. Both proprietary and open-source speech/language models are being researched and benchmarked to evaluate cost-efficiency and self-hosting feasibility, reducing dependency on third-party APIs.
status: in-progress
featured: true
order: 1
domain: llm-voice
tags:
  - AI Voice Agent
  - ASR
  - TTS
  - LLM
  - Real-time
  - Pipecat
  - LiveKit
  - vLLM
  - SGLang
  - Self-hosted
  - Vertex AI
  - Qdrant
role: AI Engineer
context: Maknadata
confidential: true
stack:
  Voice pipeline:
    - Pipecat
    - LiveKit
    - ASR
    - TTS
  Model serving:
    - vLLM
    - SGLang
    - Self-hosted
  Models and retrieval:
    - Vertex AI
    - Qdrant
coverAlt: "Illustration: a glowing microphone between two speech bubbles, under the words AI Voice Agent."
cover: ../../assets/work/voice-agent.webp
---

## Approach

It uses a cascaded voice pipeline (ASR → LLM → TTS) being built from scratch to enable natural spoken dialogue. LLM tool calling controls each conversation turn, grounding responses in scenario facts through Qdrant vector retrieval (Vertex AI embeddings). A multimodal LLM-as-judge pipeline scores recorded sales conversations against a versioned rubric.

## Evaluation

Both proprietary and open-source speech/language models are being researched and benchmarked to evaluate cost-efficiency and self-hosting feasibility, reducing dependency on third-party APIs.
