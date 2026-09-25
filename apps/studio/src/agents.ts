export type AgentId = 'personal-assistant' | 'cafe-service';
export type AgentAccent = 'user-white' | 'orange';

export type Agent = {
  id: AgentId;
  name: string;
  role: string;
  shortRole: string;
  status: string;
  description: string;
  location: string;
  accent: AgentAccent;
};

export const agents: Record<AgentId, Agent> = {
  'personal-assistant': {
    id: 'personal-assistant',
    name: 'Mochi',
    role: 'Your personal assistant',
    shortRole: 'Personal Agent',
    status: 'Ready for a task',
    description: 'Works on your behalf and asks before taking consequential actions.',
    location: 'Town square',
    accent: 'user-white',
  },
  'cafe-service': {
    id: 'cafe-service',
    name: 'Luca',
    role: 'Café service agent',
    shortRole: 'Service Agent',
    status: 'Open · 4 items available',
    description: 'Publishes a small menu, prepares orders, and reports fulfillment state.',
    location: "Luca's Cafe",
    accent: 'orange',
  },
};

export const isAgentId = (value: string | undefined): value is AgentId =>
  value === 'personal-assistant' || value === 'cafe-service';
