// Client-side helpers for the Jira and Asana integrations.
//
// These call ONLY our own /api proxy, never Jira or Asana directly. The proxy
// holds the secret tokens, so nothing sensitive ever reaches the browser.
const INTEGRATIONS_BASE = '/api';

async function integrationRequest(path, options) {
  const response = await fetch(`${INTEGRATIONS_BASE}${path}`, options);
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    // Empty or non-JSON body — leave data as an empty object.
  }

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }

  return data;
}

// Read the most recent issues from Jira (returns [] shape { key, summary, status, url }).
async function loadJiraIssues() {
  const data = await integrationRequest('/jira/tasks', { method: 'GET' });
  return data.issues || [];
}

// Read the most recent tasks from Asana (returns [] shape { name, completed, permalink_url }).
async function loadAsanaTasks() {
  const data = await integrationRequest('/asana/tasks', { method: 'GET' });
  return data.tasks || [];
}

// Build a short, consistent task description from a CRM client.
function describeClientTask(client) {
  const company = client.company || 'unknown company';
  return `CRM client: ${client.name} (${client.email}) at ${company}. Deal value: ${client.dealValue}.`;
}

function createJiraIssueForClient(client) {
  return integrationRequest('/jira/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      summary: `Follow up with ${client.name}`,
      description: describeClientTask(client),
    }),
  });
}

function createAsanaTaskForClient(client) {
  return integrationRequest('/asana/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `Follow up with ${client.name}`,
      notes: describeClientTask(client),
    }),
  });
}
