import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json({ limit: '2mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static site
app.use(express.static(path.join(__dirname, 'public')));

async function getIamToken(apiKey) {
  const params = new URLSearchParams();
  params.append('apikey', apiKey);
  params.append('grant_type', 'urn:ibm:params:oauth:grant-type:apikey');
  const resp = await axios.post('https://iam.cloud.ibm.com/identity/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 15000,
  });
  return resp.data.access_token;
}

app.post('/api/wx/chat', async (req, res) => {
  try {
    const {
      input,
      max_tokens = 2000,
      temperature = 0,
      top_p = 1,
      frequency_penalty = 0,
      presence_penalty = 0,
    } = req.body || {};

    const apiKey = process.env.WATSONX_API_KEY;
    const url = process.env.WATSONX_URL;
    const projectId = process.env.WATSONX_PROJECT_ID || process.env.WATSONX_SPACE_ID;
    const modelId = process.env.WATSONX_MODEL_ID || 'ibm/granite-3-3-8b-instruct';
    const version = process.env.WATSONX_API_VERSION || '2023-05-29';

    if (!apiKey || !url || !projectId) {
      return res.status(400).json({ error: 'Missing WATSONX_* env vars' });
    }

    const token = await getIamToken(apiKey);
    const chatUrl = `${url}/ml/v1/text/chat?version=${encodeURIComponent(version)}`;
    const body = {
      project_id: projectId,
      model_id: modelId,
      frequency_penalty,
      max_tokens,
      presence_penalty,
      temperature,
      top_p,
    };
    if (input) {
      body.messages = [{ role: 'user', content: String(input) }];
    }

    const wxResp = await axios.post(chatUrl, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });
    return res.json(wxResp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    return res.status(status).json({ error: 'wx_call_failed', details: data });
  }
});

app.post('/api/wxo/chat', async (req, res) => {
  try {
    const { input } = req.body || {};
    const apiKey = process.env.WXO_API_KEY;
    const instanceUrl = process.env.WXO_INSTANCE_URL;
    const agentId = process.env.WXO_AGENT_ID;
    if (!apiKey || !instanceUrl || !agentId) {
      return res.status(400).json({ error: 'Missing WXO_* env vars' });
    }
    const token = await getIamToken(apiKey);
    const url = `${instanceUrl}/v1/orchestrate/${agentId}/chat/completions?environment=live`;
    const body = {
      messages: input ? [{ role: 'user', content: String(input) }] : [],
      stream: false
    };
    const resp = await axios.post(url, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      timeout: 60000,
    });
    return res.json(resp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    // eslint-disable-next-line no-console
    console.error('wxo_call_failed', status, data);
    return res.status(status).json({ error: 'wxo_call_failed', details: data });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Nickel server listening on http://localhost:${port}`);
}); 