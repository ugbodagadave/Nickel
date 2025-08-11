# watsonx.ai setup

This project uses watsonx.ai APIs/SDKs. You must provide:
- IBM Cloud API key
- watsonx.ai endpoint URL (region)
- Project ID (or Space ID as applicable)

Required environment variables:
- `IBM_CLOUD_API_KEY`
- `WATSONX_URL` (e.g., `https://us-south.ml.cloud.ibm.com`, or `https://eu-de.ml.cloud.ibm.com`, etc.)
- `WATSONX_PROJECT_ID` (preferred) or `WATSONX_SPACE_ID`

Quick steps:
1) Obtain credentials (Hackathon account):
   - Join IBM Cloud hackathon account and access watsonx.ai per the guide.
   - Create or identify your Project in watsonx.ai and copy its Project ID.
2) Generate IAM token at runtime (server side) using `IBM_CLOUD_API_KEY`.
3) Call watsonx.ai endpoints with `Authorization: Bearer <token>` and your `project_id`.

Notes:
- Foundation model inference consumes tokens (RUs). Track credits as explained in the hackathon guide.
- Prefer lower runtime sizes for notebooks to conserve credits if you use notebook runtimes.

References:
- IBM Hackathon Guide (2025 Pre-conference watsonx Hackathon):
  - https://watsonx-challenge-2025.s3.us.cloud-object-storage.appdomain.cloud/IBM-2025-Pre-TXC-Hackathon-Guide.pdf
- IBM watsonx.ai API docs:
  - https://cloud.ibm.com/apidocs/watsonx-ai 