import { describe, expect, it } from 'vitest';
import {
  isCafeTask,
  isMessageInTransit,
  projectLuca,
  projectMochi,
  projectSkynet,
  type ActivityEvent,
} from './activity.ts';

const taskEvent: ActivityEvent = {
  schemaVersion: '1.0',
  eventId: 'event-1',
  runId: 'run-1',
  sequence: 1,
  logicalTime: 1,
  source: 'observed',
  visibility: 'studio',
  type: 'task.requested',
  actorId: 'user',
  subjectId: 'personal-assistant',
  payload: { message: 'Order an iced matcha.' },
};

describe('Mochi activity projection', () => {
  it('starts ready for a task', () => {
    expect(projectMochi([]).state).toBe('ready');
  });

  it('derives task receipt and discovery from the event stream', () => {
    const discoveryEvent: ActivityEvent = {
      schemaVersion: '1.0',
      eventId: 'event-2',
      runId: 'run-1',
      sequence: 2,
      logicalTime: 2,
      source: 'simulated',
      visibility: 'studio',
      type: 'discovery.started',
      actorId: 'personal-assistant',
      subjectId: 'cafe-service',
      causalParentId: taskEvent.eventId,
      payload: { query: 'cafe menu under $8' },
    };

    expect(projectMochi([taskEvent])).toMatchObject({
      state: 'task-received',
      latestTask: 'Order an iced matcha.',
    });
    expect(projectMochi([taskEvent, discoveryEvent])).toMatchObject({
      state: 'discovering',
      status: 'Discovering services',
    });
    expect(projectSkynet([taskEvent, discoveryEvent])).toMatchObject({
      agentId: 'personal-assistant',
      title: 'Discovery started',
      source: 'simulated',
      causalParentId: 'event-1',
    });
  });

  it('keeps Skynet empty until an action occurs', () => {
    expect(projectSkynet([])).toBeNull();
  });

  it('routes only tasks matching Luca’s advertised café domain', () => {
    expect(isCafeTask('Get an oat milk matcha under $8')).toBe(true);
    expect(isCafeTask('Please book me a flight')).toBe(false);
  });

  it('shows a message in transit until Luca receives it', () => {
    const sentEvent: ActivityEvent = {
      ...taskEvent,
      eventId: 'event-2',
      sequence: 2,
      logicalTime: 2,
      type: 'message.sent',
      actorId: 'personal-assistant',
      subjectId: 'cafe-service',
      causalParentId: taskEvent.eventId,
      source: 'simulated',
      payload: { message: 'Get an oat milk matcha.' },
    };
    const receivedEvent: ActivityEvent = {
      ...taskEvent,
      eventId: 'event-3',
      sequence: 3,
      logicalTime: 3,
      type: 'message.received',
      actorId: 'cafe-service',
      subjectId: 'cafe-service',
      causalParentId: sentEvent.eventId,
      source: 'simulated',
      payload: { message: 'Get an oat milk matcha.', senderId: 'personal-assistant' },
    };

    expect(isMessageInTransit([taskEvent, sentEvent])).toBe(true);
    expect(isMessageInTransit([taskEvent, sentEvent, receivedEvent])).toBe(false);
    expect(projectLuca([taskEvent, sentEvent, receivedEvent])).toMatchObject({
      state: 'request-received',
      status: 'Request received',
    });
    expect(projectSkynet([taskEvent, sentEvent, receivedEvent])?.agentId).toBe('cafe-service');
  });
});
