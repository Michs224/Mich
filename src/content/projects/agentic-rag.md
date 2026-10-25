---
title: Alma (Agentic Conversational System)
summary: Alma is a conversational agentic system that enables users to interact with multiple data sources through natural language.
description: "Alma is a conversational agentic system that enables users to interact with multiple data sources through natural language. The system integrates RAG (Retrieval-Augmented Generation) for document-based queries, text-to-SQL for database operations (e.g., checking product stock), and web search capabilities for real-time information retrieval. Users can seamlessly ask questions about products from various sources: documents, databases, or the web. The agent automatically routes queries to the appropriate retrieval method."
period:
  start: 2024-12
status: shipped
featured: true
order: 3
domain: llm-voice
tags:
  - AI Agent
  - RAG
  - Text-to-SQL
  - LLM
  - LangChain
  - LangGraph
  - Milvus
  - Groq
  - FastAPI
  - OpenAI
  - Gemini
  - Tavily
  - PostgreSQL
  - Docker
stack:
  Agent and retrieval:
    - LangChain
    - LangGraph
    - Milvus
    - Tavily
  Models:
    - Groq
    - OpenAI
    - Gemini
  Backend:
    - FastAPI
    - PostgreSQL
    - Docker
coverAlt: "Architecture diagram: a router sends each user question to RAG over a Milvus vector store, a SQL query on PostgreSQL, or web search through a ReAct agent with Tavily. The retrieved data feeds prompt generation, and an LLM writes the answer."
cover: ../../assets/work/agentic-architecture.webp
---

## Approach

The system integrates RAG (Retrieval-Augmented Generation) for document-based queries, text-to-SQL for database operations (e.g., checking product stock), and web search capabilities for real-time information retrieval. Users can seamlessly ask questions about products from various sources: documents, databases, or the web. The agent automatically routes queries to the appropriate retrieval method.
