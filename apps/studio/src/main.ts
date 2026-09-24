import './styles.css';
import { agents, isAgentId, type Agent, type AgentId } from './agents.ts';
import {
  isCafeTask,
  isMessageInTransit,
  projectLuca,
  projectMochi,
  projectSkynet,
  type ActivityEvent,
} from './activity.ts';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Studio root was not found.');
}

const avatar = (agent: Agent) => `
  <span class="avatar avatar--${agent.accent}" aria-hidden="true">
    <span class="avatar__shadow"></span>
    <span class="avatar__legs"></span>
    <span class="avatar__body"></span>
    <span class="avatar__head"></span>
    <span class="avatar__hair"></span>
    <span class="avatar__face"></span>
    <span class="avatar__detail"></span>
  </span>
`;

const agentButton = (agent: Agent, placement: string) => `
  <button
    class="world-agent world-agent--${placement}"
    type="button"
    data-agent-id="${agent.id}"
    aria-label="Select ${agent.name}, ${agent.role}"
    aria-pressed="false"
  >
    <span class="world-agent__status" aria-hidden="true"></span>
    <span class="agent-bubble" data-${agent.id === 'personal-assistant' ? 'mochi' : 'luca'}-bubble hidden></span>
    ${avatar(agent)}
    <span class="world-agent__label">
      <strong>${agent.name}</strong>
      <small>${agent.shortRole}</small>
    </span>
  </button>
`;

app.innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Agentopia Studio home">
        <span class="brand__mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="brand__wordmark">Agentopia</span>
        <span class="brand__product">Studio</span>
      </a>
      <div class="topbar__context">
        <span class="phase-pill"><i aria-hidden="true"></i> Phase 1</span>
        <span class="run-label">World preview</span>
      </div>
      <button class="icon-button" type="button" aria-label="Settings unavailable in preview" disabled>
        <span aria-hidden="true">•••</span>
      </button>
    </header>

    <main class="studio" aria-label="Agentopia Studio preview">
      <section class="world-panel" aria-labelledby="world-title">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Agentopia world</p>
            <h1 id="world-title">Morning in Luma</h1>
          </div>
          <div class="world-state"><span></span> Live preview</div>
        </div>

        <div class="world-frame">
          <div class="world-scene" role="group" aria-label="Luma town map with two agents">
            <div class="sun-glow"></div>
            <div class="hill hill--one"></div>
            <div class="hill hill--two"></div>
            <div class="river" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="bridge" aria-hidden="true"></div>
            <div class="path path--main" aria-hidden="true"></div>
            <div class="path path--cafe" aria-hidden="true"></div>

            <div class="cafe" aria-label="Luca's Cafe">
              <span class="cafe__chimney"></span>
              <span class="cafe__roof"></span>
              <span class="cafe__sign">Luca's Cafe</span>
              <span class="cafe__awning"></span>
              <span class="cafe__door"></span>
              <span class="cafe__window cafe__window--one"></span>
              <span class="cafe__window cafe__window--two"></span>
              <span class="cafe__planter"></span>
            </div>

            <div class="town-square" aria-hidden="true">
              <span class="town-square__center"></span>
              <span class="bench bench--one"></span>
              <span class="bench bench--two"></span>
            </div>

            <div class="tree tree--one" aria-hidden="true"><i></i></div>
            <div class="tree tree--two" aria-hidden="true"><i></i></div>
            <div class="tree tree--three" aria-hidden="true"><i></i></div>
            <div class="tree tree--four" aria-hidden="true"><i></i></div>
            <div class="flower-bed flower-bed--one" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i><i></i>
            </div>
            <div class="flower-bed flower-bed--two" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i>
            </div>
            <div class="flower-bed flower-bed--three" aria-hidden="true">
              <i></i><i></i><i></i><i></i>
            </div>

            <div class="agent-link" data-agent-link hidden aria-hidden="true"><i></i></div>
            ${agentButton(agents['personal-assistant'], 'assistant')}
            ${agentButton(agents['cafe-service'], 'cafe')}

            <div class="map-hint" aria-hidden="true">
              <span class="map-hint__cursor">↖</span>
              Activity appears in Skynet automatically
            </div>
          </div>
          <div class="world-frame__corner world-frame__corner--tl"></div>
          <div class="world-frame__corner world-frame__corner--tr"></div>
          <div class="world-frame__corner world-frame__corner--bl"></div>
          <div class="world-frame__corner world-frame__corner--br"></div>
        </div>

        <form class="chat-composer" data-chat-form>
          <div class="mochi-portrait" aria-hidden="true">
            <span class="mochi-portrait__hair"></span>
            <span class="mochi-portrait__face"></span>
          </div>
          <label class="chat-composer__field">
            <span>Message Mochi</span>
            <input
              name="message"
              type="text"
              maxlength="240"
              autocomplete="off"
              placeholder="Ask Mochi to do something…"
              aria-label="Message Mochi"
              data-chat-input
            />
          </label>
          <button type="submit" data-chat-send>
            <span>Send</span>
            <i aria-hidden="true">↗</i>
          </button>
        </form>

        <div class="world-footer">
          <div class="population"><span class="population__faces" aria-hidden="true">● ●</span> 2 agents in world</div>
          <div class="world-controls" aria-label="World controls unavailable in preview">
            <button type="button" disabled aria-label="Pause unavailable"><span aria-hidden="true">Ⅱ</span></button>
            <button type="button" disabled aria-label="Center map unavailable"><span aria-hidden="true">⌖</span></button>
            <span>UI preview · Simulation not started</span>
          </div>
        </div>
      </section>

      <aside class="inspector-panel" aria-labelledby="skynet-title">
        <div class="inspector-heading">
          <div>
            <h2 id="skynet-title">Skynet</h2>
            <p class="inspector-context" data-inspector-context>Waiting for activity</p>
          </div>
          <span class="inspector-badge"><i></i> Observing</span>
        </div>

        <div class="empty-inspector" data-empty-inspector>
          <div class="radar" aria-hidden="true">
            <span class="radar__ring radar__ring--one"></span>
            <span class="radar__ring radar__ring--two"></span>
            <span class="radar__sweep"></span>
            <span class="radar__dot"></span>
          </div>
          <h3>Waiting for agent activity</h3>
          <p>Skynet will open the relevant agent automatically when an action occurs.</p>
        </div>

        <div class="agent-inspector" data-agent-inspector hidden>
          <div class="agent-card__top">
            <div class="agent-card__avatar" data-agent-avatar></div>
            <div>
              <p class="agent-card__role" data-agent-role></p>
              <h3 data-agent-name></h3>
            </div>
          </div>
          <div class="status-row"><span></span><strong data-agent-status></strong></div>
          <section class="live-activity" data-live-activity hidden aria-live="polite">
            <p>Latest action</p>
            <h4 data-activity-title></h4>
            <div class="live-activity__detail" data-activity-detail></div>
            <dl>
              <div><dt>Source</dt><dd data-activity-source></dd></div>
              <div><dt>Event</dt><dd data-activity-event></dd></div>
              <div><dt>Caused by</dt><dd data-activity-parent></dd></div>
            </dl>
          </section>
          <p class="agent-description" data-agent-description></p>
          <dl class="agent-facts">
            <div><dt>Location</dt><dd data-agent-location></dd></div>
            <div><dt>Source</dt><dd>Simulated</dd></div>
            <div><dt>Activity</dt><dd data-agent-activity>No events yet</dd></div>
          </dl>
          <div class="coming-next">
            <span>Next step</span>
            <p>More causal evidence will appear here as the interaction continues.</p>
          </div>
        </div>
      </aside>
    </main>

    <footer class="timeline-shell" aria-label="Shared timeline placeholder">
      <span class="timeline-shell__label">Shared timeline</span>
      <div class="timeline-track" data-timeline-track><i></i></div>
      <span class="timeline-shell__time" data-timeline-time>00:00</span>
      <span class="timeline-shell__note" data-timeline-note>Begins with the first event</span>
    </footer>
  </div>
`;

const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-agent-id]'));
const inspectorContext = document.querySelector<HTMLElement>('[data-inspector-context]');
const emptyInspector = document.querySelector<HTMLElement>('[data-empty-inspector]');
const agentInspector = document.querySelector<HTMLElement>('[data-agent-inspector]');
const chatForm = document.querySelector<HTMLFormElement>('[data-chat-form]');
const chatInput = document.querySelector<HTMLInputElement>('[data-chat-input]');
const mochiBubble = document.querySelector<HTMLElement>('[data-mochi-bubble]');
const lucaBubble = document.querySelector<HTMLElement>('[data-luca-bubble]');
const agentLink = document.querySelector<HTMLElement>('[data-agent-link]');
const liveActivity = document.querySelector<HTMLElement>('[data-live-activity]');
const timelineTrack = document.querySelector<HTMLElement>('[data-timeline-track]');
const timelineTime = document.querySelector<HTMLElement>('[data-timeline-time]');
const timelineNote = document.querySelector<HTMLElement>('[data-timeline-note]');

const activityEvents: ActivityEvent[] = [];
const runId = 'run-studio-preview';
let eventSequence = 0;
let selectedAgentId: AgentId | null = null;
let scheduledTimers: number[] = [];

const field = (name: string) => document.querySelector<HTMLElement>(`[data-agent-${name}]`);

const selectAgent = (id: AgentId) => {
  const agent = agents[id];
  selectedAgentId = id;

  buttons.forEach((button) => {
    const isSelected = button.dataset.agentId === id;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });

  if (inspectorContext) inspectorContext.textContent = `${agent.name} · ${agent.shortRole}`;
  if (emptyInspector) emptyInspector.hidden = true;
  if (agentInspector) agentInspector.hidden = false;

  const avatarSlot = field('avatar');
  if (avatarSlot) avatarSlot.innerHTML = avatar(agent);
  const values: Record<string, string> = {
    role: agent.role,
    name: agent.name,
    status: agent.status,
    description: agent.description,
    location: agent.location,
  };
  Object.entries(values).forEach(([key, value]) => {
    const element = field(key);
    if (element) element.textContent = value;
  });

  renderActivity();
};

const renderActivity = () => {
  const mochiProjection = projectMochi(activityEvents);
  const lucaProjection = projectLuca(activityEvents);
  const skynetProjection = projectSkynet(activityEvents);
  const mochiButton = buttons.find((button) => button.dataset.agentId === 'personal-assistant');
  const lucaButton = buttons.find((button) => button.dataset.agentId === 'cafe-service');

  if (mochiButton) {
    mochiButton.dataset.activityState = mochiProjection.state;
    mochiButton.setAttribute('aria-label', `Select Mochi, Personal Agent. ${mochiProjection.status}`);
  }
  if (lucaButton) {
    lucaButton.dataset.activityState = lucaProjection.state;
    lucaButton.setAttribute('aria-label', `Select Luca, Service Agent. ${lucaProjection.status}`);
  }

  if (mochiBubble) {
    mochiBubble.textContent = mochiProjection.bubble ?? '';
    mochiBubble.hidden = mochiProjection.bubble === null;
  }
  if (lucaBubble) {
    lucaBubble.textContent = lucaProjection.bubble ?? '';
    lucaBubble.hidden = lucaProjection.bubble === null;
  }
  if (agentLink) {
    agentLink.hidden = !isMessageInTransit(activityEvents);
  }

  if (selectedAgentId === 'personal-assistant') {
    const status = field('status');
    if (status) status.textContent = mochiProjection.status;
  }
  if (selectedAgentId === 'cafe-service') {
    const status = field('status');
    if (status) status.textContent = lucaProjection.status;
  }

  if (skynetProjection && liveActivity) {
    liveActivity.hidden = false;
    const activityValues: Record<string, string> = {
      title: skynetProjection.title,
      detail: skynetProjection.detail,
      source: skynetProjection.source,
      event: skynetProjection.eventId,
      parent: skynetProjection.causalParentId ?? 'Root event',
    };
    Object.entries(activityValues).forEach(([key, value]) => {
      const element = document.querySelector<HTMLElement>(`[data-activity-${key}]`);
      if (element) element.textContent = value;
    });
  }

  const activityCount = document.querySelector<HTMLElement>('[data-agent-activity]');
  if (activityCount && selectedAgentId) {
    const count = activityEvents.filter(
      (event) => event.actorId === selectedAgentId || event.subjectId === selectedAgentId,
    ).length;
    activityCount.textContent = count === 1 ? '1 event' : `${count} events`;
  }

  if (timelineTrack) {
    timelineTrack.replaceChildren();
    if (activityEvents.length === 0) {
      timelineTrack.append(document.createElement('i'));
    } else {
      activityEvents.forEach((event) => {
        const marker = document.createElement('span');
        marker.className = `timeline-marker timeline-marker--${event.source}`;
        marker.title = event.type;
        marker.setAttribute('aria-label', `Event ${event.sequence}: ${event.type}`);
        timelineTrack.append(marker);
      });
    }
  }
  if (timelineTime) timelineTime.textContent = `00:${String(eventSequence).padStart(2, '0')}`;
  if (timelineNote && skynetProjection) timelineNote.textContent = skynetProjection.title;
};

const nextEnvelope = () => {
  eventSequence += 1;
  return {
    schemaVersion: '1.0' as const,
    eventId: `event-${eventSequence}`,
    runId,
    sequence: eventSequence,
    logicalTime: eventSequence,
    visibility: 'studio' as const,
  };
};

const appendActivityEvent = (event: ActivityEvent) => {
  activityEvents.push(event);
  const skynetProjection = projectSkynet(activityEvents);
  if (skynetProjection) selectAgent(skynetProjection.agentId);
  else renderActivity();
};

const schedule = (delay: number, callback: () => void) => {
  scheduledTimers.push(window.setTimeout(callback, delay));
};

const sendTaskToMochi = (message: string) => {
  scheduledTimers.forEach((timer) => window.clearTimeout(timer));
  scheduledTimers = [];

  const taskEvent: ActivityEvent = {
    ...nextEnvelope(),
    type: 'task.requested',
    source: 'observed',
    actorId: 'user',
    subjectId: 'personal-assistant',
    payload: { message },
  };
  appendActivityEvent(taskEvent);

  let parentEventId = taskEvent.eventId;
  schedule(800, () => {
    const discoveryEvent: ActivityEvent = {
      ...nextEnvelope(),
      type: 'discovery.started',
      source: 'simulated',
      actorId: 'personal-assistant',
      subjectId: 'cafe-service',
      causalParentId: parentEventId,
      payload: { query: message },
    };
    parentEventId = discoveryEvent.eventId;
    appendActivityEvent(discoveryEvent);
  });

  if (!isCafeTask(message)) {
    schedule(1600, () => {
      appendActivityEvent({
        ...nextEnvelope(),
        type: 'discovery.no-match',
        source: 'simulated',
        actorId: 'personal-assistant',
        subjectId: 'personal-assistant',
        causalParentId: parentEventId,
        payload: {
          query: message,
          reason: 'The current registry contains no service agent advertising capabilities for this task.',
        },
      });
    });
    return;
  }

  schedule(1500, () => {
    const event: ActivityEvent = {
      ...nextEnvelope(),
      type: 'discovery.candidate-found',
      source: 'simulated',
      actorId: 'personal-assistant',
      subjectId: 'cafe-service',
      causalParentId: parentEventId,
      payload: { candidateName: "Luca's Cafe" },
    };
    parentEventId = event.eventId;
    appendActivityEvent(event);
  });
  schedule(2200, () => {
    const event: ActivityEvent = {
      ...nextEnvelope(),
      type: 'discovery.candidate-validated',
      source: 'simulated',
      actorId: 'personal-assistant',
      subjectId: 'cafe-service',
      causalParentId: parentEventId,
      payload: { capabilities: ['menu lookup', 'price constraints', 'cafe orders'] },
    };
    parentEventId = event.eventId;
    appendActivityEvent(event);
  });
  schedule(2900, () => {
    const event: ActivityEvent = {
      ...nextEnvelope(),
      type: 'discovery.agent-selected',
      source: 'simulated',
      actorId: 'personal-assistant',
      subjectId: 'cafe-service',
      causalParentId: parentEventId,
      payload: { reason: "Luca's Cafe matches the requested café task and exposes the required capabilities." },
    };
    parentEventId = event.eventId;
    appendActivityEvent(event);
  });
  schedule(3600, () => {
    const event: ActivityEvent = {
      ...nextEnvelope(),
      type: 'message.sent',
      source: 'simulated',
      actorId: 'personal-assistant',
      subjectId: 'cafe-service',
      causalParentId: parentEventId,
      payload: { message },
    };
    parentEventId = event.eventId;
    appendActivityEvent(event);
  });
  schedule(4400, () => {
    appendActivityEvent({
      ...nextEnvelope(),
      type: 'message.received',
      source: 'simulated',
      actorId: 'cafe-service',
      subjectId: 'cafe-service',
      causalParentId: parentEventId,
      payload: { message, senderId: 'personal-assistant' },
    });
  });
};

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    if (isAgentId(button.dataset.agentId)) {
      selectAgent(button.dataset.agentId);
    }
  });
});

chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = chatInput?.value.trim() ?? '';
  if (!message) return;

  sendTaskToMochi(message);
  if (chatInput) {
    chatInput.value = '';
    chatInput.focus();
  }
});

renderActivity();
