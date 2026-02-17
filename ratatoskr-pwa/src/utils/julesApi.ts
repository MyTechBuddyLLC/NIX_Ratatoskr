const JULES_API_BASE_URL = 'https://jules.googleapis.com/v1alpha';

export interface JulesSession {
  name: string;
  id: string;
  title?: string;
  prompt: string;
  state: 'QUEUED' | 'PLANNING' | 'AWAITING_PLAN_APPROVAL' | 'AWAITING_USER_FEEDBACK' | 'IN_PROGRESS' | 'PAUSED' | 'FAILED' | 'COMPLETED';
  createTime: string;
  updateTime: string;
  sourceContext?: {
    source: string;
  };
}

export interface JulesActivity {
  name: string;
  id: string;
  originator: 'user' | 'agent' | 'system';
  description: string;
  createTime: string;
  agentMessaged?: {
    text: string;
  };
  userMessaged?: {
    text: string;
  };
  progressUpdated?: {
    progress: number;
    description: string;
  };
}

export interface JulesSource {
  name: string;
  id: string;
  githubSourceContext?: {
    owner: string;
    repo: string;
  };
}

export async function listSessions(apiKey: string): Promise<JulesSession[]> {
  const response = await fetch(`${JULES_API_BASE_URL}/sessions`, {
    headers: {
      'x-goog-api-key': apiKey,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to list sessions: ${response.statusText}`);
  }
  const data = await response.json();
  return data.sessions || [];
}

export async function listActivities(apiKey: string, sessionId: string): Promise<JulesActivity[]> {
  const response = await fetch(`${JULES_API_BASE_URL}/sessions/${sessionId}/activities`, {
    headers: {
      'x-goog-api-key': apiKey,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to list activities: ${response.statusText}`);
  }
  const data = await response.json();
  return data.activities || [];
}

export async function listSources(apiKey: string): Promise<JulesSource[]> {
  const response = await fetch(`${JULES_API_BASE_URL}/sources`, {
    headers: {
      'x-goog-api-key': apiKey,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to list sources: ${response.statusText}`);
  }
  const data = await response.json();
  return data.sources || [];
}
