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

- [ ] Establish clear Agentopia, Skynet, shared-protocol, and Studio boundaries in the repository.
- [ ] Move the activity contract and canonical append-only run history to a server-authoritative path.
- [ ] Publish Mochi, Luca, and a small set of additional first-party agents behind stable public identities and real protocol endpoints.
- [ ] Give the first-party agents overlapping or partial capabilities so discovering Luca requires genuine candidate validation, rejection, ranking, and selection rather than a hardcoded route.
- [ ] Publish machine-readable discovery metadata for the first-party agents and keep claimed identity, network location, ownership evidence, and observed behavior separate.
- [ ] Implement an interchangeable discovery-policy boundary with a transparent candidate source and recorded selection reasons.
- [ ] Integrate real discovery and interaction adapters so public artifacts and protocol exchanges, rather than frontend fixtures, produce observed events.
- [ ] Bring a small curated set of external-agent cases from Comparison Engine into Skynet through the neutral activity protocol.
- [ ] Support three explicit run modes: live observation, replay of a recorded real observation, and simulation.
- [ ] Complete one real first-party flow: accept a task, discover several candidates, reject and rank them, select Luca, interact through A2A or MCP, use a tool, and verify the result.
- [ ] Complete at least one external-agent investigation that exposes a meaningful agreement, conflict, partial result, or failure without inventing missing information.
- [ ] Make Skynet explain discovery hops, extracted claims, candidate decisions, protocol negotiation, tool calls, failures, and verification with links to exact evidence.
- [ ] Derive Agentopia, Skynet, selection, and replay views from the same event history and stable identifiers.
- [ ] Require explicit approval before state-changing external actions; apply endpoint allowlisting, network protections, timeouts, size limits, redaction, and credential isolation.
- [ ] Add recorded fixtures and automated tests so the demonstrations remain reproducible when public endpoints change or disappear.
- [ ] Document how to publish a compatible agent and run the vertical slice locally.

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
- Do not describe a configured candidate list as an open-ended search of the agent ecosystem.
- Add or update schemas before introducing unstructured activity payloads.
- Prefer evidence-backed explanations over hidden reasoning or unsupported certainty.
- Preserve stable public agent identities even when hosting or implementation changes.
- Keep deployment providers and model providers replaceable.
- Update this plan only for durable product or architectural decisions; keep temporary implementation details in progress notes.
