# Nickel

Nickel is a POC chat‑first accounting assistant built on IBM watsonx.ai and IBM watsonx Orchestrate. It processes invoices, reconciles transactions, performs basic anomaly checks, and generates reports via an embedded Orchestrate chat UI.

## Docs
- Product requirements: `prd.md`
- Development plan: `development_plan.md`
- Memory bank: `memory-bank/`

## Stack
- UI: static site embedding Orchestrate web chat
- Orchestration: IBM watsonx Orchestrate
- AI services: IBM watsonx.ai (SaaS)
- Hosting: Render.com

## Configuration (environment variables)
- IBM Cloud / watsonx.ai:
  - `IBM_CLOUD_API_KEY`
  - `WATSONX_URL` (e.g., `https://us-south.ml.cloud.ibm.com`)
  - `WATSONX_PROJECT_ID` or `WATSONX_SPACE_ID`
- Orchestrate:
  - `WXO_INSTANCE_URL`
  - `WXO_API_KEY`
  - `WXO_AGENT_ID`
  - `WXO_TENANT_NAME` (if applicable)
- App/Render:
  - `NODE_ENV`, `LOG_LEVEL`, `ENCRYPTION_KEY`, `MAX_UPLOAD_MB`, `ALLOWED_FILE_TYPES`

Do not commit secrets. Configure variables in Render’s dashboard or your local `.env` ignored by git.

## Development
- Phases and tasks are tracked in `development_plan.md`.
- Tests and CI will be added as code is introduced.

## License
TBD (MIT/Apache-2.0). 