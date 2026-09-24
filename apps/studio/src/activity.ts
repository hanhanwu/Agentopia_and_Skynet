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

export type TaskRequestedEvent = EventEnvelope & {
  type: 'task.requested';
  actorId: 'user';
  subjectId: 'personal-assistant';
  payload: { message: string };
};

export type DiscoveryStartedEvent = EventEnvelope & {
  type: 'discovery.started';
  actorId: 'personal-assistant';
  subjectId: 'cafe-service';
  payload: { query: string };
};

export type ActivityEvent = TaskRequestedEvent | DiscoveryStartedEvent;

export type MochiProjection = {
  state: 'ready' | 'task-received' | 'discovering';
  status: string;
  bubble: string | null;
  latestTask: string | null;
};

export type SkynetProjection = {
  agentId: AgentId;
  title: string;
  detail: string;
  source: ActivitySource;
  eventId: string;
  causalParentId: string | null;
};

export const projectMochi = (events: readonly ActivityEvent[]): MochiProjection => {
  let projection: MochiProjection = {
    state: 'ready',
    status: 'Ready for a task',
    bubble: null,
    latestTask: null,
  };

  for (const event of events) {
    if (event.type === 'task.requested') {
      projection = {
        state: 'task-received',
        status: 'Task received',
        bubble: 'I’ve got it!',
        latestTask: event.payload.message,
      };
    }

    if (event.type === 'discovery.started') {
      projection = {
        ...projection,
        state: 'discovering',
        status: 'Discovering Luca',
        bubble: 'I’m looking for the right service…',
      };
    }
  }

  return projection;
};

export const projectSkynet = (events: readonly ActivityEvent[]): SkynetProjection | null => {
  const latest = events.at(-1);
  if (!latest) return null;

  if (latest.type === 'task.requested') {
    return {
      agentId: 'personal-assistant',
      title: 'Task received',
      detail: `User asked Mochi: “${latest.payload.message}”`,
      source: latest.source,
      eventId: latest.eventId,
      causalParentId: latest.causalParentId ?? null,
    };
  }

  return {
    agentId: 'personal-assistant',
    title: 'Discovery started',
    detail: `Mochi is searching for a service agent for: “${latest.payload.query}”`,
    source: latest.source,
    eventId: latest.eventId,
    causalParentId: latest.causalParentId ?? null,
  };
};
