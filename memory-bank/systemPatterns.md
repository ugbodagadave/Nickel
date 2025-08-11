# System Patterns — Nickel

## Architecture
- Frontend: Static site embedding IBM watsonx Orchestrate web chat.
- Orchestration: Orchestrate orchestrator routes to skills/agents.
- AI Services: IBM watsonx.ai endpoints for extraction, chat, embeddings.
- Optional: External agent via Agent Connect exposing `/v1/chat` or `/v1/chat/completions` with SSE and tool_calls.

## Patterns
- Server‑side secret handling; no client‑side keys.
- Normalization of extracted data into stable JSON schemas.
- Human‑in‑the‑loop based on confidence thresholds.
- Exporters (CSV, simple PDF) as stateless server endpoints.

## Integrations
- IAM token generation for watsonx.ai.
- Orchestrate instance URL + API key; agent/skill IDs.
- Render environment variables for runtime configuration. 