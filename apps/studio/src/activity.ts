import type { AgentId } from './agents.ts';

export type ActivitySource = 'observed' | 'simulated';

type EventEnvelope = {
  schemaVersion: '1.0';
  eventId: string;
  runId: string;
  sequence: number;
  logicalTime: number;
  source: ActivitySource;
  visibility: 'studio';
  actorId: 'user' | AgentId;
  subjectId: AgentId;
  causalParentId?: string;
};

export type ActivityEvent =
  | (EventEnvelope & {
      type: 'task.requested';
      actorId: 'user';
      subjectId: 'personal-assistant';
      payload: { message: string };
    })
  | (EventEnvelope & {
      type: 'discovery.started';
      actorId: 'personal-assistant';
      payload: { query: string };
    })
  | (EventEnvelope & {
      type: 'discovery.candidate-found';
      actorId: 'personal-assistant';
      subjectId: 'cafe-service';
      payload: { candidateName: string };
    })
  | (EventEnvelope & {
      type: 'discovery.candidate-validated';
      actorId: 'personal-assistant';
      subjectId: 'cafe-service';
      payload: { capabilities: string[] };
    })
  | (EventEnvelope & {
      type: 'discovery.agent-selected';
      actorId: 'personal-assistant';
      subjectId: 'cafe-service';
      payload: { reason: string };
    })
  | (EventEnvelope & {
      type: 'discovery.no-match';
      actorId: 'personal-assistant';
      subjectId: 'personal-assistant';
      payload: { query: string; reason: string };
    })
  | (EventEnvelope & {
      type: 'message.sent';
      actorId: 'personal-assistant';
      subjectId: 'cafe-service';
      payload: { message: string };
    })
  | (EventEnvelope & {
      type: 'message.received';
      actorId: 'cafe-service';
      subjectId: 'cafe-service';
      payload: { message: string; senderId: 'personal-assistant' };
    });

export type AgentProjection = {
  state: string;
  status: string;
  bubble: string | null;
};

export type MochiProjection = AgentProjection & { latestTask: string | null };

export type SkynetProjection = {
  agentId: AgentId;
  title: string;
  detail: string;
  source: ActivitySource;
  eventId: string;
  causalParentId: string | null;
};

const cafeTerms = /\b(cafe|café|coffee|espresso|latte|matcha|tea|drink|beverage|cappuccino|mocha|oat milk)\b/i;

export const isCafeTask = (message: string): boolean => cafeTerms.test(message);

export const projectMochi = (events: readonly ActivityEvent[]): MochiProjection => {
  let projection: MochiProjection = {
    state: 'ready',
    status: 'Ready for a task',
    bubble: null,
    latestTask: null,
  };

  for (const event of events) {
    switch (event.type) {
      case 'task.requested':
        projection = { state: 'task-received', status: 'Task received', bubble: 'I’ve got it!', latestTask: event.payload.message };
        break;
      case 'discovery.started':
        projection = { ...projection, state: 'discovering', status: 'Discovering services', bubble: 'I’m looking for the right service…' };
        break;
      case 'discovery.candidate-found':
        projection = { ...projection, state: 'checking', status: 'Checking Luca', bubble: 'I found Luca’s Cafe!' };
        break;
      case 'discovery.candidate-validated':
        projection = { ...projection, state: 'validating', status: 'Validating capabilities', bubble: 'Luca can help with this.' };
        break;
      case 'discovery.agent-selected':
        projection = { ...projection, state: 'selected', status: 'Luca selected', bubble: 'I found the right service!' };
        break;
      case 'message.sent':
        projection = { ...projection, state: 'waiting', status: 'Waiting for Luca', bubble: 'Request sent to Luca.' };
        break;
      case 'message.received':
        projection = { ...projection, state: 'waiting', status: 'Waiting for Luca', bubble: 'Luca received my request.' };
        break;
      case 'discovery.no-match':
        projection = { ...projection, state: 'no-match', status: 'No matching service', bubble: 'I couldn’t find a matching service.' };
        break;
    }
  }

  return projection;
};

export const projectLuca = (events: readonly ActivityEvent[]): AgentProjection => {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index];
    if (event?.type === 'task.requested') break;
    if (event?.type === 'message.received') {
      return { state: 'request-received', status: 'Request received', bubble: 'New request from Mochi!' };
    }
  }

  return { state: 'available', status: 'Open · 4 items available', bubble: null };
};

export const isMessageInTransit = (events: readonly ActivityEvent[]): boolean => {
  const latestCommunication = [...events]
    .reverse()
    .find((event) => event.type === 'message.sent' || event.type === 'message.received');
  return latestCommunication?.type === 'message.sent';
};

export const projectSkynet = (events: readonly ActivityEvent[]): SkynetProjection | null => {
  const latest = events.at(-1);
  if (!latest) return null;

  const base = {
    source: latest.source,
    eventId: latest.eventId,
    causalParentId: latest.causalParentId ?? null,
  };

  switch (latest.type) {
    case 'task.requested':
      return { ...base, agentId: 'personal-assistant', title: 'Task received', detail: `User asked Mochi: “${latest.payload.message}”` };
    case 'discovery.started':
      return { ...base, agentId: 'personal-assistant', title: 'Discovery started', detail: `Mochi is searching for a service agent for: “${latest.payload.query}”` };
    case 'discovery.candidate-found':
      return { ...base, agentId: 'personal-assistant', title: 'Candidate discovered', detail: `${latest.payload.candidateName} was found in the service registry.` };
    case 'discovery.candidate-validated':
      return { ...base, agentId: 'personal-assistant', title: 'Capabilities validated', detail: `Luca advertises: ${latest.payload.capabilities.join(', ')}.` };
    case 'discovery.agent-selected':
      return { ...base, agentId: 'personal-assistant', title: 'Luca selected', detail: latest.payload.reason };
    case 'discovery.no-match':
      return { ...base, agentId: 'personal-assistant', title: 'No matching service', detail: latest.payload.reason };
    case 'message.sent':
      return { ...base, agentId: 'personal-assistant', title: 'Message sent', detail: `Mochi sent Luca: “${latest.payload.message}”` };
    case 'message.received':
      return { ...base, agentId: 'cafe-service', title: 'Request received', detail: `Luca received Mochi’s request: “${latest.payload.message}”` };
  }
};
