# watsonx.ai setup

This project uses watsonx.ai APIs/SDKs. You must provide:
- API key
- watsonx.ai endpoint URL (region)
- Project ID (or Space ID as applicable)

Required environment variables:
- `WATSONX_API_KEY`
- `WATSONX_URL` (e.g., `https://us-south.ml.cloud.ibm.com`, or `https://eu-de.ml.cloud.ibm.com`, etc.)
- `WATSONX_PROJECT_ID` (preferred) or `WATSONX_SPACE_ID`
- `WATSONX_MODEL_ID` (e.g., `ibm/granite-3-3-8b-instruct`)
- `WATSONX_API_VERSION` (e.g., `2023-05-29`)

Quick steps:
1) Obtain credentials (Hackathon account):
   - Join IBM Cloud hackathon account and access watsonx.ai per the guide.
   - Create or identify your Project in watsonx.ai and copy its Project ID.
2) Generate IAM token at runtime (server side) using `WATSONX_API_KEY`.
3) Call watsonx.ai endpoints with `Authorization: Bearer <token>`, your `project_id`, and chosen `model_id`.

Notes:
- Foundation model inference consumes tokens (RUs). Track credits as explained in the hackathon guide.
- Prefer lower runtime sizes for notebooks to conserve credits if you use notebook runtimes.

References:
- IBM Hackathon Guide (2025 Pre-conference watsonx Hackathon):
  - https://watsonx-challenge-2025.s3.us.cloud-object-storage.appdomain.cloud/IBM-2025-Pre-TXC-Hackathon-Guide.pdf
- IBM watsonx.ai API docs:
  - https://cloud.ibm.com/apidocs/watsonx-ai 