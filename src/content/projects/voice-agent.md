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
keyStack:
  - Pipecat
  - LiveKit
  - vLLM
  - Qdrant
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
pipeline:
  - id: speech
    label: Speech in
    detail: The sales rep talks
  - id: asr
    label: ASR
    tech: speech to text
  - id: llm
    label: LLM
    tech: tool calling
    detail: Controls each turn and pulls scenario facts from Qdrant
  - id: tts
    label: TTS
    tech: text to speech
  - id: out
    label: Voice out
    detail: The AI customer answers
trace:
  - id: speech
    label: Speech in
    speaker: rep
    kind: speech
    output: If you sign this week, we can include onboarding for free.
  - id: transcript
    label: Transcript
    tech: ASR
    kind: text
    output: if you sign this week we can include onboarding for free
  - id: turn
    label: Turn control
    tech: LLM tool calling, Qdrant
    kind: tool
    output: get_scenario_facts("onboarding") → The customer tried a similar tool last year. Adoption stalled.
  - id: reply
    label: Persona reply
    tech: LLM
    speaker: agent
    kind: text
    output: We tried something like this last year and nobody used it. What’s different this time?
  - id: voice
    label: Voice out
    tech: TTS
    speaker: agent
    kind: speech
    output: We tried something like this last year and nobody used it. What’s different this time?
  - id: score
    label: After the call
    tech: LLM-as-a-judge
    kind: score
    output: The recorded call is scored against a versioned rubric.
---

## Approach

It uses a cascaded voice pipeline (ASR → LLM → TTS) being built from scratch to enable natural spoken dialogue. LLM tool calling controls each conversation turn, grounding responses in scenario facts through Qdrant vector retrieval (Vertex AI embeddings). A multimodal LLM-as-judge pipeline scores recorded sales conversations against a versioned rubric.

## Evaluation

Both proprietary and open-source speech/language models are being researched and benchmarked to evaluate cost-efficiency and self-hosting feasibility, reducing dependency on third-party APIs.
