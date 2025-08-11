# Nickel – Development Plan

## Guiding principles
- Test → Document → Commit → Push workflow on every change.
- Small vertical slices per phase with demoable outcomes.
- Secrets never in client or repo; use environment variables and Render secrets.
- Observability and eval baked in from the start.

## Phase 0 — Project bootstrap
Deliverables:
- Repo scaffolding: `docs/`, `src/` (if needed), `public/`, `.github/` (CI optional), `memory-bank/` (project docs), `prd.md`, `development_plan.md`, `README.md`, `CHANGELOG.md`.
- License and code of conduct (if applicable).
- Render blueprint optional (`.render.yaml`) or dashboard setup notes.

Required info from you:
- GitHub access to remote `ugbodagadave/Nickel` (push permissions).
- Preferred OSS license (MIT/Apache-2.0?).

Env variables to prepare (not committed):
- General: `NODE_ENV`, `LOG_LEVEL`, `ENCRYPTION_KEY` (random, for server-side session/crypto if used).

Testing/docs:
- Initialize testing framework (see Phase 2). Add `README` with run/build/test instructions.

## Phase 1 — Orchestrate chat embed + demo flows skeleton
Goals:
- Minimal web app hosted on Render with Orchestrate web chat embedded.
- Clickable demo: run a mock “Process sample invoice” and “Reconcile sample CSV” via scripted chat intents (no real AI backend yet).

Tasks:
- Static site scaffold (HTML/JS) with secure embed per Orchestrate’s “Web chats” guidance.
- Add sample files and instructions to trigger flows.
- Simulate responses (mock) to validate UX and report rendering.

Required info from you:
- Orchestrate SaaS details:
  - `WXO_INSTANCE_URL`
  - `WXO_API_KEY`
  - `WXO_AGENT_ID` (orchestrator/collaborator to target) and/or skill identifiers.
  - Any tenant name if required (e.g., `WXO_TENANT_NAME`).

Env vars:
- `WXO_INSTANCE_URL`, `WXO_API_KEY`, `WXO_AGENT_ID`, `WXO_TENANT_NAME` (optional).

Testing/docs:
- Smoke tests for build and link check.
- Document embed steps, required headers, and troubleshooting in `docs/orchestrate.md`.

## Phase 2 — watsonx.ai integration (extraction + chat)
Goals:
- Connect to watsonx.ai for:
  - Document extraction of invoices/receipts (where available) or prompt‑based OCR pipeline.
  - Text chat/LLM for categorization hints and explanations.

Tasks:
- Server‑side integration module to call watsonx.ai endpoints using IBM Cloud IAM tokens.
- Region‑aware base URL selection (us‑south/eu‑de/eu‑gb/jp‑tok/au‑syd/ca‑tor/ap‑south‑1).
- Implement simple normalization schema for invoices and transactions.

Required info from you:
- IBM Cloud:
  - `IBM_CLOUD_API_KEY`
  - `WATSONX_URL` (e.g., `https://us-south.ml.cloud.ibm.com`)
  - Either `WATSONX_PROJECT_ID` or `WATSONX_SPACE_ID`
  - Preferred base model(s) (Granite / Llama 3 / Mistral) for prompts

Env vars:
- `IBM_CLOUD_API_KEY`, `WATSONX_URL`, `WATSONX_PROJECT_ID` or `WATSONX_SPACE_ID`.

Testing/docs:
- Unit tests: auth token retrieval, endpoint calls, error mapping, schema validation.
- Contract tests with mocked ml endpoints.
- Update `README` and `docs/watsonx.md` with curl examples and error codes.

## Phase 3 — Orchestration of flows in Orchestrate
Goals:
- Replace mocks with actual skills/agents from Orchestrate triggering watsonx.ai tasks.
- Human‑in‑the‑loop review for low‑confidence extractions.

Tasks:
- Configure Orchestrate agent/skills for:
  - Invoice processing sequence (extract → validate → approve/review → export)
  - Reconciliation sequence (parse CSVs → match → diff report → export)
- Map tool outputs to chat responses (tables + download links).
- Define thresholds and review prompts.

Required info from you:
- Existing skills or need to import/build (provide JSON or pointers).
- Confidence thresholds for auto‑approve vs. review.

Env vars:
- None new if Phase 1 set is complete.

Testing/docs:
- End‑to‑end manual script with synthetic data; screenshot evidence.
- Document flow diagrams and parameters in `docs/flows.md`.

## Phase 4 — Optional external agent via Agent Connect (ACF)
Goals:
- Demonstrate connecting an external agent (Node/Python) exposing `/v1/chat` or `/v1/chat/completions` with SSE streaming and `tool_calls`.

Tasks:
- Scaffold external agent with function tools (e.g., CSV diff, vendor lookup, regex cleanup).
- Deploy to Render/Code Engine; register/route from Orchestrate.

Required info from you:
- Decide if ACF demo is required for POC.

Env vars:
- Agent service URL (private) and any tool secrets (kept server‑side only).

Testing/docs:
- Contract test for event stream and tool_calls.
- `docs/agent-connect.md` with endpoints and examples.

## Phase 5 — Reporting, exports, and metrics
Goals:
- Generate CSV/PDF outputs; capture metrics dashboard for KPI tracking.

Tasks:
- Server endpoint to render reports (CSV, basic PDF).
- Capture metrics: task duration, accuracy proxy, reconciliation match rate, HIL count.

Required info from you:
- Preferred export layouts (CSV columns, PDF header/footer branding).

Env vars:
- None specific; keep metrics in app storage or log aggregator (POC).

Testing/docs:
- Golden‑file tests for exports; metrics assertions.
- `docs/metrics.md` with KPI definitions.

## Phase 6 — Hardening: security, error handling, accessibility
Goals:
- Secrets safe, errors clear, UI accessible.

Tasks:
- Ensure no client‑side secrets; middleware pattern for any server calls.
- Redaction in logs; set retention policy.
- A11y audit on chat and uploader.

Required info from you:
- Retention preference (7/14/30 days for POC logs/artifacts).

Testing/docs:
- Security checklist in `docs/security.md`.
- A11y checklist/results in `docs/accessibility.md`.

## Testing Strategy
- Unit tests: integration modules (watsonx.ai), data normalization, CSV parsing.
- Integration tests: Orchestrate chat flows with stubbed endpoints.
- E2E scripts: happy paths for the 3 key use cases.
- Non‑functional: basic load test on 100‑transaction reconciliation.

## Documentation Strategy
- Always update: `README.md`, `CHANGELOG.md`, `docs/*` per feature.
- Architecture and flow diagrams in `docs/`.
- API snippets (curl, Node/Python) for watsonx.ai and Orchestrate.

## Version Control & CI/CD
- Conventional commits (feat/fix/docs/chore/test/refactor).
- Protect main; use PRs; enable checks (lint/test) if CI available.
- Each phase ends with a tagged release (poc-phaseN).

## Environment Variables (summary)
- IBM Cloud / watsonx.ai:
  - `IBM_CLOUD_API_KEY`
  - `WATSONX_URL`
  - `WATSONX_PROJECT_ID` or `WATSONX_SPACE_ID`
- Orchestrate:
  - `WXO_INSTANCE_URL`
  - `WXO_API_KEY`
  - `WXO_AGENT_ID`
  - `WXO_TENANT_NAME` (if applicable)
- App/Render:
  - `NODE_ENV`, `LOG_LEVEL`, `ENCRYPTION_KEY`, `MAX_UPLOAD_MB`, `ALLOWED_FILE_TYPES`

## Inputs I will request from you at each phase
- Phase 0: License choice, repo permissions.
- Phase 1: Orchestrate instance/API key/agent IDs.
- Phase 2: IBM Cloud keys, region URL, project/space ID, preferred models.
- Phase 3: Skill definitions or approval to create/import; thresholds.
- Phase 5: Export format preferences, branding.
- Phase 6: Data retention preference.

## Acceptance for POC completion
- Chat‑first UI with file upload working end‑to‑end for:
  - Invoice processing on sample PDFs with ≥90% accuracy and review path.
  - Reconciliation on sample CSVs in <30s with diff report export.
  - Basic anomaly alert demo with reason codes.
- Metrics visible; docs complete; tests green. 