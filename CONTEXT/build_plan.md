# Agentopia and Skynet Build Plan

## Purpose

Build two related but independently useful open-source products:

- **Agentopia:** an environment for publishing, connecting, testing, and simulating agents and tools.
- **Skynet:** an observation and analysis system for real and simulated agent discovery, selection, interaction, tool use, and verification.
- **Studio:** a combined experience that presents Agentopia and Skynet over the same activity history.

The first release must demonstrate real public agents and real protocol traffic. Simulation remains important, but it must be clearly distinguished from observation.

## Durable Principles

- **Events are the source of truth.** Meaningful activity produces a structured, causally linked event.
- **Evidence is inspectable.** Explanations link to the discovery artifact, protocol exchange, or prior event that supports them.
- **Provenance is explicit.** Distinguish `observed`, `reported`, `derived`, and `simulated` information.
- **Visibility is honest.** Never present an external agent's unavailable internals or private reasoning as observed fact.
- **Protocols remain open.** Do not bind either product to one agent framework or model provider.
- **Live and reproducible both matter.** Support live observation and replay of timestamped real observations, alongside explicitly simulated runs.
- **Security is part of the product.** Treat public endpoints as untrusted and protect credentials, private data, and state-changing actions.
- **Build thin vertical slices.** Keep a modular monolith until demonstrated needs justify additional infrastructure.

## Durable UI Direction

- **Skynet is the primary information surface.** On wide screens, begin with roughly two-fifths of the workspace for Agentopia and three-fifths for Skynet; adapt responsively without losing either view.
- **Agentopia provides orientation, not decorative scenery.** Use a dark, minimal, line-based world that makes agents, connections, messages, tools, waiting, failures, and outcomes easy to follow.
- **Agents use a coherent visual grammar.** Begin with the approved arch-and-tentacle character silhouette, then distinguish agents through shape details, symbols, labels, and color rather than color alone.
- **Animation communicates recorded state.** Motion must correspond to activity events and must not imply work, communication, or reasoning that was not observed or simulated.
- **Skynet explains before exposing raw detail.** Present a plain-language finding first, followed by causal trace, provenance, protocol data, and exact evidence.
- **Both views share selection and time.** Selecting an agent, connection, tool, artifact, or event updates both products against the same history and replay cursor.
- **Important visual elements are designed before implementation.** Use `UI_elements_design` for editable SVG masters, reviewable previews, state sheets, layout studies, and short behavioral notes; implementations should reuse approved concepts rather than invent replacements.
- **Accessibility is required.** Preserve readable contrast, keyboard access, reduced-motion behavior, and non-animated representations of meaningful states.

## Product Boundaries

```text
published first-party agents ─┐
external public agents ──────┼── activity events ──▶ Skynet
Agentopia scenarios ─────────┘                         │
                                                      ▼
                                             evidence and projections
                                                      │
Agentopia ◀──────────── shared history ─────────── Studio
```

### Agentopia owns

- First-party agent and tool environments.
- Scenarios, world state, commands, and simulated time.
- Connections to external agents.
- Reproducible simulation and test inputs.
- Neutral activity-event production.

### Skynet owns

- Event ingestion, validation, normalization, and storage.
- Live and historical timelines.
- Discovery-path and causal-trace reconstruction.
- Evidence-backed observations, comparisons, and verification.
- Read models and explanations for its UI and API.

### Shared activity protocol owns

- Versioned runtime-validated event schemas.
- Stable run, trace, span, actor, subject, artifact, and causal identifiers.
- Provenance, visibility, timing, compatibility, and redaction metadata.
- Neutral contracts that do not depend on either product's UI.

## Phase 1: Real Observable Vertical Slice

### 1. Define the demonstration and visual language

- [ ] Write one short vertical-slice specification covering the user task, candidate source, candidate roles, expected decisions, interaction, tool result, verification, and completion criteria.
- [ ] Define a small first-party cast: Mochi, Luca, and several plausible alternatives with overlapping, partial, unavailable, or incompatible capabilities.
- [ ] Map each step of the demonstration to its observable evidence, required activity events, Agentopia representation, and Skynet explanation.
- [ ] Establish `UI_elements_design` as the source for approved visual concepts, with editable SVG masters, reviewable image previews, and short behavioral notes.
- [ ] Define the dark visual system: color roles, typography, spacing, line weights, contrast, and reduced-motion behavior.
- [ ] Design the base agent silhouette and a small set of distinguishable variants that remain identifiable without relying only on color.
- [ ] Design the essential activity states: idle, discovering, validating, rejected, selected, communicating, waiting, using a tool, failed, and verified.
- [ ] Design connection, message, tool, artifact, evidence, provenance, and status primitives.
- [ ] Approve one combined layout in which Agentopia provides orientation and Skynet receives more space for explanation and evidence.
- [ ] Approve one storyboard showing the complete vertical slice at the intended screen size before producing additional visual assets.

### 2. Establish the shared runtime foundation

- [ ] Establish clear Agentopia, Skynet, shared-protocol, and Studio boundaries in the repository.
- [ ] Define runtime-validated schemas for the events required by the vertical slice before adding new activity payloads.
- [ ] Include stable identifiers, causality, timing, provenance, visibility, redaction, and artifact references in the shared contract.
- [ ] Move commands and the canonical append-only run history to a server-authoritative path.
- [ ] Make both live observations and replayed observations enter through the same validated event-ingestion boundary.
- [ ] Derive Agentopia, Skynet, selection, and replay state from the same event history and stable identifiers.

### 3. Publish the first-party agents

- [ ] Publish Luca behind a stable public identity with machine-readable discovery metadata and at least one real A2A or MCP interaction path.
- [ ] Give Luca one small, safe tool that returns a verifiable result through a real protocol exchange.
- [ ] Publish the alternative agents behind their own stable identities and real discovery metadata.
- [ ] Ensure the alternatives create meaningful validation and rejection outcomes rather than differing only in name or appearance.
- [ ] Publish Mochi behind a stable public identity and make it accept the demonstration task through a real interface.
- [ ] Keep deployment and model providers replaceable behind the public identities and protocol contracts.

### 4. Implement real discovery and orchestration

- [ ] Define a transparent candidate source and identify it honestly in every run.
- [ ] Implement interchangeable discovery and selection-policy boundaries.
- [ ] Fetch and validate public discovery artifacts instead of inserting capabilities or endpoints from frontend fixtures.
- [ ] Record every candidate, artifact fetch, extracted claim, validation outcome, rejection, ranking decision, and final selection.
- [ ] Make Mochi select Luca from observed evidence rather than a hardcoded identity or keyword route.
- [ ] Complete the real interaction, tool call, result delivery, and evidence-linked verification.
- [ ] Preserve claimed identity, verified ownership, network location, and observed behavior as separate concepts.

### 5. Build the evidence-first Studio experience

- [ ] Implement the shared timeline, event selection, and synchronized historical cursor first.
- [ ] Make Skynet present a plain-language finding before deeper causal, protocol, and artifact evidence.
- [ ] Show discovery hops, extracted fields, candidate decisions, protocol negotiation, tool calls, failures, timing, and verification with links to exact evidence.
- [ ] Label every conclusion as observed, reported, derived, or simulated and show when external internals are unavailable.
- [ ] Rebuild Agentopia as a compact dark visual representation driven by the same events shown in Skynet.
- [ ] Ensure selecting an agent, connection, tool, artifact, or moment updates both Agentopia and Skynet.
- [ ] Provide accessible non-animated representations for every important state.

### 6. Add external observation and reproducibility

- [ ] Adapt a small curated set of Comparison Engine cases into the neutral activity protocol without coupling Skynet to its UI.
- [ ] Complete at least one external-agent investigation that exposes a meaningful agreement, conflict, partial result, or failure without inventing missing information.
- [ ] Support three explicit run modes: live observation, replay of a recorded real observation, and simulation.
- [ ] Store timestamped artifacts and recorded events needed to replay important real runs when public endpoints change or disappear.
- [ ] Apply endpoint allowlisting, network protections, timeouts, size limits, redaction, and credential isolation.
- [ ] Require explicit approval before state-changing external actions.

### 7. Verify and release the vertical slice

- [ ] Add contract, projection, discovery-policy, adapter, security, and replay tests for the complete demonstration.
- [ ] Verify that the same recorded run reconstructs the same Agentopia and Skynet state.
- [ ] Verify that live failures remain understandable and do not silently fall back to simulated success.
- [ ] Document how to publish a compatible agent, run the demonstration locally, and distinguish the three run modes.
- [ ] Confirm the first-release definition below with the complete first-party flow and at least one external case.

## Phase 2: Durability and Operational Safety

- [ ] Persist runs, events, agents, observations, and artifact references.
- [ ] Add live event delivery, cancellation, retries, timeouts, and recovery.
- [ ] Support durable asynchronous tasks without relying on one process or in-memory session state.
- [ ] Add structured retention, access, redaction, and visibility controls.
- [ ] Instrument the platform with correlated traces, logs, and metrics.
- [ ] Test interrupted, malicious, slow, invalid, and partially completed runs.

## Phase 3: Independent Products and Extensions

- [ ] Provide stable Agentopia APIs for loading agents, tools, scenarios, constraints, and success criteria.
- [ ] Make Agentopia usable without Skynet for agent development and automated testing.
- [ ] Provide Skynet event-ingestion, trace-import, and instrumentation interfaces that do not require Agentopia.
- [ ] Stabilize adapter, event, scenario, and verification extension points.
- [ ] Publish contributor guides and reference agents that demonstrate interoperability.
- [ ] Validate standalone uses before separating repositories or deployments.

## Phase 4: Behavioral Analysis and Scale

- [ ] Define privacy-aware behavioral observations and versioned identity hypotheses.
- [ ] Link every inference to supporting and contradicting evidence and publish its limitations.
- [ ] Evaluate analysis quality against consented ground truth.
- [ ] Add adversarial scenarios for impersonation, manipulation, and unreliable claims.
- [ ] Introduce stronger isolation, additional services, or separate deployments only when security, users, release cadence, or measured scale requires them.

## Definition of a Successful First Release

A visitor can watch Skynet discover several genuinely published agents, understand why candidates were accepted or rejected, observe a real A2A or MCP interaction and tool call, inspect the evidence behind each explanation, and replay the run. The visitor can also inspect at least one external-agent case and can always tell whether information was observed, reported, derived, recorded, or simulated.

## Guidance for Future Work

- Preserve Agentopia and Skynet as independent products connected by a neutral protocol.
- Read the Durable UI Direction and inspect approved work in `UI_elements_design` before changing the Studio UI or creating visual assets.
- Do not describe a configured candidate list as an open-ended search of the agent ecosystem.
- Add or update schemas before introducing unstructured activity payloads.
- Prefer evidence-backed explanations over hidden reasoning or unsupported certainty.
- Preserve stable public agent identities even when hosting or implementation changes.
- Keep deployment providers and model providers replaceable.
- Update this plan only for durable product or architectural decisions; keep temporary implementation details in progress notes.
