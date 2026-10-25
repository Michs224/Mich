---
title: Vision QC (Fiber Installation Audit)
summary: Vision LLM system that checks fiber installation photos against an ISP's photo standards. The proof of concept won the tender, and production is underway.
description: Vision LLM system that checks FTTH field installation photos against the photo standards of an Indonesian ISP. The proof of concept compared open and closed vision models and won the tender. The production system keeps what the model sees apart from what is decided, measures every change against ground truth, and runs behind its own API.
status: in-progress
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
  - FastAPI
  - PostgreSQL
  - Kubeflow
  - Self-hosted
role: AI Engineer
context: Maknadata, client work for an Indonesian ISP
confidential: true
stack:
  Models:
    - Qwen3-VL
    - Claude
    - Kimi K2.5
    - Amazon Nova
    - Gemini
  Inference:
    - vLLM
    - Self-hosted
    - AWS Bedrock
    - Vertex AI
  Service:
    - Python
    - FastAPI
    - PostgreSQL
    - OpenCV
  Experiments:
    - Kubeflow
coverAlt: "Illustration: a utility pole inside a camera frame, between a check mark and a warning sign, under the words Vision QC."
cover: ../../assets/work/vision-qc.webp
---

## From proof of concept to production

The proof of concept put open and closed vision models behind one provider layer and compared them: Qwen3-VL on a self-hosted vLLM server; Claude, Kimi K2.5, and Amazon Nova on AWS Bedrock; and Gemini on Vertex AI. I chose a self-hosted Qwen3-VL-32B to meet data residency requirements, and added an OpenCV quality gate that turns away unusable photos before any model call.

The proof of concept won the tender. Maknadata is now the vendor, and the production system is built so its results can be trusted and its standards can change safely.

## How it decides

The model reports what it sees in each photo, point by point, with its evidence. The verdict comes from versioned rules rather than from the model, so the same observations always lead to the same result, and every result can be traced back to what was seen.

## What I built

The experiment workflow the AI team uses to tune rules, prompts, and models against ground truth, with the cost of every run, and the assessment service that runs the checks through an API and keeps a record of every prompt, model, and call.
