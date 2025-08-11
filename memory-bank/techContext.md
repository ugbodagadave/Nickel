# Tech Context — Nickel

## Languages & Runtimes
- Web: HTML/JS (static site)
- Optional server: Node.js or Python for proxy/export endpoints and ACF agent

## Platforms
- IBM Cloud watsonx.ai (SaaS)
- IBM watsonx Orchestrate (SaaS)
- Render.com for hosting

## Key SDKs/APIs
- IBM watsonx.ai Python/JS SDKs or raw REST (ml/v4 text/chat/extraction where applicable)
- Orchestrate ADK and SaaS APIs (web chat embed)
- Agent Connect spec for external agents

## Constraints
- Secrets via env; never client‑exposed
- Synthetic data only; minimal retention; redaction in logs
- Performance targets (see PRD) 