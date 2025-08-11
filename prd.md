# Nickel AI Agent – Product Requirements Document (PRD)

## 1. Introduction

### 1.1 Product Overview
Nickel is a proof‑of‑concept, chat‑first “virtual accounting assistant” that automates repetitive finance workflows (invoice processing, reconciliation, expense management, payroll/tax prep, audit support) using IBM watsonx.ai for AI services and IBM watsonx Orchestrate for multi‑agent orchestration and workflow execution. Users interact via a web chat embedded from Orchestrate, upload documents, trigger automations, and receive structured, exportable outputs.

Recent platform notes (2025):
- IBM watsonx Orchestrate has introduced multi‑agent orchestration with routing to agents, assistants, and skills, plus external agent connectivity via the IBM Agent Connect Framework (ACF). This enables Nickel to combine orchestrator logic with external tools or agents when needed.
- The IBM watsonx.ai API (ml endpoints) remains the primary interface for model inference, document extraction, and embeddings; authentication uses IBM Cloud IAM bearer tokens.
- Orchestrate Developer Edition + ADK can be used for local development; SaaS tenants support API access with instance URL and API key.

References:
- IBM Orchestrate ADK and docs: developer.watson-orchestrate.ibm.com
- IBM Agent Connect overview: connect.watson-orchestrate.ibm.com
- IBM watsonx.ai API: cloud.ibm.com/apidocs/watsonx-ai

### 1.2 Purpose
This PRD aligns product, engineering, and design on Nickel’s POC scope, constraints, feature set, success criteria, and validation plan. It specifies “what” to build and test; detailed “how” appears in the development plan and technical design docs.

### 1.3 Scope
- In scope:
  - Web POC with chat UI embedded from Orchestrate; file upload; execution of agentic tasks; structured outputs (JSON, tables, PDFs/CSVs).
  - IBM watsonx.ai for AI tasks: OCR/NLP extraction, classification, basic anomaly detection; optional embeddings for RAG; prompt templates.
  - IBM watsonx Orchestrate for orchestration; optional Agent Connect for integrating external agents (following OpenAI‑style chat/completions interface) when needed.
  - Hosting on Render.com (static or simple Node service) with environment variable based configuration.
  - Sample datasets (synthetic invoices, statements) and simulated flows.
  - Metrics tracking for POC evaluation.
- Out of scope:
  - Enterprise HA/DR; mobile apps; complex legal compliance beyond basic privacy and logging; advanced model fine‑tuning.

### 1.4 Assumptions and Inputs
- IBM Cloud access (watsonx.ai and Orchestrate) is available with credits; models (e.g., Granite, Llama 3 family, Mistral) perform adequately for POC without fine‑tuning.
- Sample data is available and shareable; no production PII is used.
- Orchestrate SaaS instance URL and API key, and at least one orchestrator/agent ID, are available for integration.

### 1.5 Dependencies
- IBM watsonx.ai SDK/API (IAM auth)
- IBM watsonx Orchestrate ADK/Orchestrate API; Agent Connect for external agent integration (optional)
- Render.com for hosting

## 2. Target Users and Personas
As provided (Alex – Accountant; Jordan – Bookkeeper; Taylor – Finance Manager) with goals to reduce manual work, speed reconciliations, and improve audit readiness.

## 3. Business Goals and Success Criteria
- Demonstrate 50% reduction in manual task time on test flows.
- Achieve ≥90% extraction accuracy on sample invoices; <5% reconciliation error on 100+ transactions.
- POC infra cost < $500 using trials/credits.
- CSAT > 4/5.

Key KPIs:
- Task success rate, average handling time per flow, extraction precision/recall, reconciliation match rate, false positive rate for anomaly alerts, number of human‑review fallbacks, user feedback scores.

## 4. Features and Functionalities

### 4.1 Core Flows
1) Data Collection & Ingestion
- Upload PDFs/JPG/CSV (≤10MB). Use watsonx.ai OCR/extraction endpoints (Document Extraction beta where applicable) and/or prompts with foundation models.
- Validate basic schema; return normalized JSON for downstream steps.

2) Invoice Processing
- Extract vendor, date, line items, totals, tax; cross‑check against mock PO data; apply heuristics/thresholds for auto‑approve vs. review.

3) Transaction Categorization & Reconciliation
- Categorize expenses with ML prompts or lightweight classifiers; reconcile bank CSV vs. ledger; produce diff reports with explanations.

4) Fraud/Anomaly Checks
- Basic anomaly patterns (amount spikes, vendor mismatch, duplicate invoices); return risk score and reason codes.

5) Expense Management
- Parse receipt images; policy checks; approve/flag; export entries.

6) Audit Support & Bookkeeping
- Produce audit trails, journal entries, and variance explanations. Export as CSV/PDF; store structured artifacts.

7) Reporting & Insights
- Generate summaries (e.g., cash flow snapshot, expenses by category, flagged anomalies) as downloadable CSV/PDF; render as chat tables.

### 4.2 Chat & Orchestration
- Chat interface embedded from Orchestrate (web chat). Orchestrate orchestrator agent routes to assistants/skills/agents. Optionally integrate external agents via Agent Connect exposing /v1/chat or /v1/chat/completions schema (OpenAI‑like), supporting streaming and tool_calls.
- Human‑in‑the‑loop fallback when confidence < threshold; user prompted for approval or correction in chat.

### 4.3 Authentication & Roles (POC)
- Minimal login using Orchestrate’s access control or Render’s protected preview; basic viewer/editor distinction for audit actions.

### 4.4 Logging & Observability
- Log inputs/outputs, decisions, and API call metadata (redact sensitive fields); simple metrics panel for KPIs; optional Langfuse/telemetry for LLM traces if feasible.

### 4.5 Error Handling
- Graceful errors for invalid/corrupt files; actionable prompts (retry, manual entry); transparent model/API errors; chat notifications.

## 5. Use Cases & Acceptance Criteria

1) Invoice Automation Flow
- Given: PDF invoice upload
- When: User invokes “process invoice”
- Then: Extracted JSON with ≥95% field accuracy on test set; approval decision with reason; export option. Errors push to review with highlighted fields.

2) Reconciliation
- Given: Bank CSV + ledger CSV
- When: User runs “reconcile”
- Then: 100 transactions processed in <30s; mismatches flagged with explanations; downloadable diff report.

3) Fraud Alert
- Given: Mixed transactions
- When: Run anomaly check
- Then: Risk score with top reason codes; precision/recall documented on sample set; configurable threshold in settings.

## 6. Technical Requirements

### 6.1 Architecture (POC)
- Frontend: Static site (Render) embedding Orchestrate web chat.
- Backend: Prefer Orchestrate SaaS + watsonx.ai APIs; optional lightweight Node/Python for file upload proxying and export generation. External agents (optional) deployed per ACF exposing /v1/chat with streaming and tool_calls.
- Data Flow: User → Orchestrate chat → routed skills/agents → watsonx.ai inference/extraction → results to chat; files temporarily stored (ephemeral) or passed to doc extraction API.

### 6.2 Integrations
- watsonx.ai endpoints (e.g., text chat, document extraction beta, embeddings). Base URLs by region (us‑south, eu‑de, eu‑gb, jp‑tok, au‑syd, ca‑tor, ap‑south‑1).
- Orchestrate SaaS: Instance URL + API key; chat with agent via Orchestrate APIs; web chat embed.
- Agent Connect (optional): Implement OpenAI‑style /v1/chat or /v1/chat/completions with SSE streaming; support tool_calls for function execution.

### 6.3 Security & Privacy
- IAM bearer tokens; never expose keys client‑side; use server/middleware if needed.
- Encrypt data in transit; avoid persistent PII; redact logs; configurable retention (POC default: 7–30 days ephemeral).
- Role‑based access (basic) for actions/exports.

### 6.4 Non‑functional
- Performance: ≤1.5s median chat response for simple queries; ≤30s for batch reconciliations of 100 rows.
- Reliability: POC only; graceful degradation on model/API overload (HTTP 429/503). Retry/backoff.
- Accessibility: WCAG 2.1 AA for core flows.

## 7. UI/UX
- Landing: sign‑in/start demo; quick actions (“Process invoice”, “Reconcile”) and sample files.
- Chat: sticky uploader; structured replies (tables, chips); download buttons.
- Errors: inline toasts + troubleshooting links.

## 8. Data Model (POC)
- Invoice: vendor, invoice_no, date, currency, lines[{desc, qty, unit, amount}], subtotal, tax, total.
- Transaction: date, description, amount, currency, category, ref_id, match_status.
- Audit log: timestamp, actor, action, resource, decision, confidence, reason_codes.

## 9. Environments & Configuration
- IBM Cloud: IBM_CLOUD_API_KEY, WATSONX_URL (e.g., https://us-south.ml.cloud.ibm.com), WATSONX_PROJECT_ID or WATSONX_SPACE_ID.
- Orchestrate: WXO_INSTANCE_URL, WXO_API_KEY, WXO_AGENT_ID (orchestrator/collaborator), WXO_TENANT_NAME (if used).
- App: NODE_ENV, LOG_LEVEL, ENCRYPTION_KEY (for any server secrets), MAX_UPLOAD_MB, ALLOWED_FILE_TYPES.
- Render: set all runtime vars in dashboard; no secrets in client.

## 10. Risks & Mitigations
- Variability in extraction accuracy → include manual review + correction UI; log confidence.
- API rate limits/outages → retries, circuit‑breaker, user messaging.
- Data privacy → synthetic datasets only; no persistent PII.

## 11. Open Questions
- Preferred region and model selection (Granite vs. Llama/Mistral) per use case?
- Which flows are “must‑have” for the first demo (pick 2–3)?
- Export format preferences (CSV vs. PDF templates)?
- Any specific accounting system schemas to mimic (QuickBooks, Xero) for CSV layout? 