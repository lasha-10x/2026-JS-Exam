// Vercel Serverless Function: a thin proxy in front of the Jira Cloud REST API.
//
// Like the Asana proxy, this runs on the server so the API token stays secret.
// Jira Cloud uses HTTP Basic auth with "email:api_token" encoded as base64.
const JIRA_API_PATH = '/rest/api/3';

export default async function handler(req, res) {
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  const baseUrl = process.env.JIRA_BASE_URL; // e.g. https://your-domain.atlassian.net
  const projectKey = process.env.JIRA_PROJECT_KEY; // e.g. CRM

  if (!email || !token || !baseUrl || !projectKey) {
    return res.status(500).json({ error: 'Jira integration is not configured on the server.' });
  }

  const auth = Buffer.from(`${email}:${token}`).toString('base64');
  const headers = {
    Authorization: `Basic ${auth}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    if (req.method === 'GET') {
      const jql = encodeURIComponent(`project = ${projectKey} ORDER BY created DESC`);
      const response = await fetch(
        `${baseUrl}${JIRA_API_PATH}/search/jql?jql=${jql}&maxResults=20&fields=summary,status`,
        { headers },
      );
      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ error: data.errorMessages?.[0] || 'Jira request failed' });
      }

      const issues = (data.issues || []).map(function (issue) {
        return {
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status?.name,
          url: `${baseUrl}/browse/${issue.key}`,
        };
      });

      return res.status(200).json({ issues });
    }

    if (req.method === 'POST') {
      const { summary, description } = req.body || {};

      if (!summary || String(summary).trim().length < 3) {
        return res.status(400).json({ error: 'A summary of at least 3 characters is required.' });
      }

      const response = await fetch(`${baseUrl}${JIRA_API_PATH}/issue`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          fields: {
            project: { key: projectKey },
            summary,
            issuetype: { name: 'Task' },
            // Jira Cloud expects the description in the Atlassian Document Format.
            description: {
              type: 'doc',
              version: 1,
              content: [{ type: 'paragraph', content: [{ type: 'text', text: description || summary }] }],
            },
          },
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        const message =
          data.errorMessages?.[0] ||
          (data.errors ? Object.values(data.errors)[0] : null) ||
          'Jira request failed';
        return res.status(response.status).json({ error: message });
      }

      return res.status(201).json({ key: data.key, url: `${baseUrl}/browse/${data.key}` });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Jira proxy error:', error);
    return res.status(502).json({ error: 'Could not reach Jira.' });
  }
}
