---
title: Vision QC (Fiber Installation Audit)
summary: Vision LLM system auditing FTTH field installation photos against audit category standards for an Indonesian ISP.
description: Vision LLM system auditing FTTH field installation photos against audit category standards for an Indonesian ISP. Achieved 83.6% overall accuracy and 85.5% defect recall on a benchmark of 286 photos. Open and closed VLMs were benchmarked behind a modular provider layer (Qwen3-VL on self-hosted vLLM, Claude/Kimi K2.5/Nova via AWS Bedrock, Gemini via Vertex AI), and self-hosted Qwen3-VL-32B was selected to meet data residency constraints. An OpenCV quality gate filters unusable photos before any LLM call.
status: shipped
featured: true
order: 2
domain: vision-audio
tags:
  - VLM
  - Computer Vision
  - Qwen3-VL
  - vLLM
  - AWS Bedrock
  - Vertex AI
  - OpenCV
  - Self-hosted
role: AI Engineer
context: Maknadata, client work for an Indonesian ISP
confidential: true
keyStack:
  - Qwen3-VL
  - vLLM
  - OpenCV
  - AWS Bedrock
stack:
  Vision models:
    - Qwen3-VL-32B
    - Claude
    - Kimi K2.5
    - Nova
    - Gemini
  Serving and providers:
    - vLLM (self-hosted)
    - AWS Bedrock
    - Vertex AI
  Image processing:
    - OpenCV
metrics:
  - value: 83.6%
    label: overall accuracy
    method: benchmark of 286 photos
  - value: 85.5%
    label: defect recall
    method: benchmark of 286 photos
pipeline:
  - id: photo
    label: Field photo
    detail: FTTH installation
  - id: gate
    label: Quality gate
    tech: OpenCV
    detail: Filters unusable photos before any LLM call
  - id: vlm
    label: VLM
    tech: Qwen3-VL-32B on vLLM
  - id: verdict
    label: Audit verdict
    detail: Per audit category
---

## Approach

Open and closed VLMs were benchmarked behind a modular provider layer (Qwen3-VL on self-hosted vLLM, Claude/Kimi K2.5/Nova via AWS Bedrock, Gemini via Vertex AI), and self-hosted Qwen3-VL-32B was selected to meet data residency constraints. An OpenCV quality gate filters unusable photos before any LLM call.

## Evaluation

Achieved 83.6% overall accuracy and 85.5% defect recall on a benchmark of 286 photos.
