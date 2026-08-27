// Vercel Serverless Function: a thin proxy in front of the Asana REST API.
//
// This runs on the server, not in the browser. The Personal Access Token
// lives in an environment variable and is never sent to the client, which
// avoids the two problems with calling Asana straight from the frontend:
// CORS restrictions and exposing the secret token in public code.
const ASANA_BASE = 'https://app.asana.com/api/1.0';

export default async function handler(req, res) {
  const token = process.env.ASANA_PAT;
  const projectGid = process.env.ASANA_PROJECT_GID;

  // Guard clause: fail clearly if the server was never configured.
  if (!token || !projectGid) {
    return res.status(500).json({ error: 'Asana integration is not configured on the server.' });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    if (req.method === 'GET') {
      const response = await fetch(
        `${ASANA_BASE}/tasks?project=${projectGid}&opt_fields=name,completed,permalink_url&limit=20`,
        { headers },
      );
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ error: data.errors?.[0]?.message || 'Asana request failed' });
      }

      return res.status(200).json({ tasks: data.data });
    }

    if (req.method === 'POST') {
      const { name, notes } = req.body || {};

      if (!name || String(name).trim().length < 3) {
        return res.status(400).json({ error: 'A task name of at least 3 characters is required.' });
      }

      const response = await fetch(`${ASANA_BASE}/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          data: { name, notes: notes || '', projects: [projectGid] },
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ error: data.errors?.[0]?.message || 'Asana request failed' });
      }

      return res.status(201).json({ task: data.data });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Asana proxy error:', error);
    return res.status(502).json({ error: 'Could not reach Asana.' });
  }
}
