# Orchestrate web chat embed

Prerequisites:
- Orchestrate SaaS instance URL and API key
- An agent (orchestrator/collaborator) to target in chat

Environment variables:
- `WXO_INSTANCE_URL` (e.g., `https://api.<region>.watson-orchestrate.cloud.ibm.com/instances/<instanceId>`)
- `WXO_API_KEY` (from service credentials)
- `WXO_AGENT_ID` (set AFTER you create and deploy the agent in Orchestrate)

Steps (high level):
1) In Orchestrate, create/configure your agents and deploy.
2) Obtain `WXO_INSTANCE_URL`, `WXO_API_KEY`, and once the agent is deployed, set `WXO_AGENT_ID`.
3) Use the web chat embed instructions from Orchestrate docs to place the widget in `public/index.html`.
   - Keep secrets server-side if the embed requires tokens; never expose API keys directly in client JavaScript.
4) Test the chat with sample flows (invoice processing, reconciliation).

References:
- Orchestrate ADK & docs: https://developer.watson-orchestrate.ibm.com/
- IBM Agent Connect (optional external agents): https://connect.watson-orchestrate.ibm.com/introduction 