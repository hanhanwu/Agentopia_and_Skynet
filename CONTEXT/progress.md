# Agentopia and Skynet Progress

Last updated: 2026-09-23

## Current Status

Phase 1 is in progress. The repository currently contains an interactive Studio UI prototype and a deterministic discovery/first-contact demonstration for two scripted agents. It is not yet the complete Phase 1 vertical slice described in `build_plan.md`.

No Phase 1 checkbox in `build_plan.md` is fully satisfied yet. The plan remains unchanged.

## Implemented

### Project setup

- Added a TypeScript and Vite application scaffold.
- Added build and Vitest commands.
- Configured both development and preview servers to use `127.0.0.1:8678` with strict-port behavior.
- Documented installation, startup, and graceful shutdown of the process listening on port `8678`.
- The current production build succeeds.
- The current automated test suite contains 8 passing tests.

### Studio UI

- Added a combined Studio layout with:
  - A large Agentopia world on the left.
  - A smaller Skynet observation panel on the right.
- Created an original bright garden world with trees, flowers, paths, a river, bridge, town square, and Luca's Cafe.
- Added two visible scripted agents with stable IDs:
  - Mochi — Personal Agent.
  - Luca — Service Agent at Luca's Cafe.
- Added bright pixel-character styling, idle animation, status indicators, selection states, speech bubbles, responsive layouts, and reduced-motion support.
- Added a persistent chat bar for sending user text to Mochi.
- Simplified the interface to emphasize the world, chat, current Skynet event, and event history.
- Added a large standalone Agentopia wordmark.

### Activity events and projections

- Added a preliminary versioned TypeScript activity-event envelope containing:
  - Schema version.
  - Event ID and run ID.
  - Sequence and numeric logical time.
  - Actor and subject IDs.
  - Causal parent ID.
  - Source classification.
  - Visibility classification.
- Added preliminary event types for:
  - Task requests.
  - Discovery start.
  - Candidate discovery.
  - Candidate capability validation.
  - Agent selection.
  - No matching service.
  - Message sent.
  - Message received.
- Added in-memory append-only event collection for the current browser session.
- Derived Mochi's state, Luca's state, Skynet's latest-event view, message animation, and historical world state from activity events.
- Classified user tasks deterministically:
  - Cafe-related tasks proceed to Luca.
  - Unrelated tasks produce an honest `No matching service` result.

This event model is preliminary and remains inside the Studio application. It has not yet become the runtime-validated neutral shared-protocol package required by the build plan.

### Scripted discovery and first contact

- Implemented this deterministic UI sequence for cafe-related tasks:
  1. User sends a task to Mochi.
  2. Mochi acknowledges the task.
  3. Discovery starts.
  4. Luca's Cafe is found as a candidate.
  5. Luca's advertised capabilities are validated.
  6. Luca is selected with a recorded reason.
  7. Mochi sends the request.
  8. A visible message animation travels to Luca.
  9. Luca receives the request.
- Scripted events are currently paced 2.5 seconds apart for audience readability.
- The implementation stops at first contact. Menu retrieval, ordering, approval, payment, fulfillment, and verification are not implemented.

### Skynet UI

- Skynet automatically follows the acting agent when new events arrive; users do not need to select an agent first.
- The active agent's avatar, name, role, and current status remain visible.
- The current event displays a readable title and explanation.
- Source, event ID, and causal parent are shown directly without a disclosure toggle.
- Added a chronological, clickable event-history list.
- Selecting a previous event moves a shared presentation cursor and reconstructs both Agentopia and Skynet at that event.
- Historical review changes Skynet from `Live` to `Reviewing`.
- Events can continue arriving during historical review.
- `Return to live` reports the number of newer events and restores the latest state.
- The earlier duplicate bottom timeline was removed. A complete shared replay timeline remains planned for Phase 1.

### Automated coverage

- Tests cover the two approved stable agent IDs.
- Tests cover Mochi's event-derived states.
- Tests cover Skynet's event-derived latest action.
- Tests cover cafe-task routing and unrelated-task rejection.
- Tests cover message-in-transit and Luca-received states.
- Tests cover historical event slicing without mutation of canonical history.

## Phase 1 Checklist Audit

The following build-plan areas have partial implementation but are not complete enough to check:

- Activity event envelope and core event types: preliminary TypeScript types exist, but they are not in a shared protocol boundary and do not have runtime validation or the full Phase 1 vocabulary.
- Append-only run history: a browser-memory event array exists, but seeded scheduling, stable tie-breaking, captured nondeterminism, and a server-owned run are missing.
- Deterministic scenario: discovery and first contact are scripted, but environment tools, deterministic resolvers, and the complete task flow are missing.
- Discovery policy: candidate discovery, validation, selection, and no-match events exist, but there is no interchangeable policy interface, multi-candidate ranking, or recorded rejection path.
- Event-derived UI: the current world and Skynet views share event projections and a historical cursor, but a complete shared clock and replay system are missing.
- Combined Studio layout: the world and Skynet are present, but the complete shared timeline/replay control is not.
- Automated fixtures and tests: focused projection tests exist, but the complete reproducible demonstration fixture does not.
- Local documentation: basic commands are documented, but the finished vertical-slice scenario and architecture are not yet documented.

All other Phase 1 checklist items remain unimplemented or are only represented by future-facing UI placeholders.

## Next Planned Slice

The next planned slice is deterministic menu retrieval and an order proposal:

1. Luca responds with a typed, fixed menu through a read-only environment tool.
2. Mochi evaluates the requested item, dietary constraint, availability, and price limit.
3. Mochi produces an order proposal linked to the menu evidence.
4. The user reviews the proposal before any simulated payment or state-changing order action.
5. Agentopia and Skynet derive the new states from the same appended events.

## Primary Implementation Files

- `apps/studio/src/main.ts` — Studio markup, interaction wiring, scripted scheduling, and UI rendering.
- `apps/studio/src/activity.ts` — preliminary event types, task classification, and event-derived projections.
- `apps/studio/src/agents.ts` — stable agent fixtures.
- `apps/studio/src/styles.css` — Agentopia and Skynet presentation.
- `apps/studio/src/activity.test.ts` — activity and historical-projection tests.
- `apps/studio/src/agents.test.ts` — stable-agent fixture tests.
- `vite.config.ts` — fixed port `8678` configuration.
- `README.md` — local setup and process-management commands.
