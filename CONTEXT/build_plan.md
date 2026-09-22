# Agentopia and Skynet Build Plan

## Purpose

Build an open-source environment that makes agent discovery, decisions, tool use, and agent-to-agent interactions visible and understandable.

The project has two related but independently useful parts:

- **Agentopia:** a simulated world where agents can be created, connected, tested, and observed. It should eventually support both first-party agents and externally hosted agents.
- **Skynet:** an observation and analysis system that shows how agents are discovered, what happens during interactions, what behavior has been observed, and how conclusions or identity hypotheses were formed.
- **Studio:** the combined public experience, with the Agentopia world and Skynet inspector synchronized around the same activity timeline.

## Long-Term Goals

- Make complex agent activity approachable to non-experts without hiding important technical details.
- Provide a safe environment for testing agents and tools under reproducible scenarios.
- Observe existing agent systems without requiring them to run inside Agentopia.
- Support open, protocol-based interoperability rather than one agent framework.
- Help the community identify available capabilities, missing infrastructure, risks, and useful standards.
- Clearly distinguish facts, agent claims, simulation, and Skynet's inferences.

## Product Principles

- **Events are the source of truth.** Every meaningful discovery, interaction, tool call, decision, observation, and inference produces a structured event.
- **One timeline, multiple views.** Agentopia and Skynet visualize the same event history and shared clock.
- **Explain before exposing raw detail.** Show a readable summary first, with progressively deeper evidence and protocol data.
- **Be honest about visibility.** First-party agents may expose internals; third-party agents expose only what can actually be observed or what they report.
- **Evidence, not certainty.** Behavioral identity is represented as a versioned hypothesis with confidence and supporting or contradicting evidence.
- **Replayability matters.** Important scenarios should be reproducible, pausable, and replayable.
- **Secure by default.** Protect credentials and private reasoning, redact sensitive data, and treat external endpoints as untrusted.
- **Start simple.** Keep a modular monolith until real scale or product needs justify operational separation.

## Architectural Boundaries

Separate Agentopia and Skynet in code now, but keep them in one repository and initially deploy them together.

```text
Agentopia ──activity events──▶ Skynet
    │                           ▲
    │                           │ activity events
    ▼                           │
tools and agents         external agent systems

Agentopia + Skynet ──▶ Studio UI
```

### Agentopia owns

- World and simulation state.
- Scenario definition and execution.
- Simulated time, scheduling, and deterministic replay inputs.
- First-party agent hosting and external-agent connections.
- Tool attachment and test environments.
- Production of neutral activity events.

Agentopia must not depend on Skynet's analysis or UI internals.

### Skynet owns

- Event ingestion, validation, normalization, and storage.
- Live and historical timelines.
- Discovery-path and causal-trace reconstruction.
- Behavior observations and identity hypotheses.
- Human-readable explanations and evidence views.
- Read models used by the inspector UI.

Skynet must accept events from Agentopia and independently instrumented external systems. It must not depend on Agentopia's simulation implementation.

### Shared activity protocol owns

- Versioned event envelopes and schemas.
- Run, trace, span, actor, subject, time, source, and visibility identifiers.
- Compatibility rules for producers and consumers.
- Clear source labels such as `observed`, `reported`, `derived`, and `simulated`.

Events should describe domain activity, not UI actions. Both products communicate only through this neutral contract or stable public APIs.

## High-Level System Design

- **Web experience:** the large Agentopia world, a smaller Skynet inspector, and a shared timeline/replay control.
- **Control plane:** commands, discovery, interaction orchestration, policy enforcement, event ingestion, and live event delivery.
- **Agent host:** runs first-party agents behind stable agent interfaces. Agents may later be isolated without changing their public identity.
- **External adapters:** connect protocol-compatible agents and allow additional protocols to be added without changing the core domain.
- **Persistence:** an append-only event history plus query-friendly projections for agents, runs, interactions, observations, and hypotheses.
- **Artifact storage:** large outputs and files are referenced from events rather than embedded in them.
- **Instrumentation:** external systems can submit activity through a small SDK, an observability adapter, a gateway, or imported trace files.

Use TypeScript for the initial platform and shared contracts. Add language-specific workers only when a concrete workload requires them. Keep the backend separate from the browser process so long-running agent work is not tied to a web request lifecycle.

## Agent Identity and Discovery

- Give every agent a stable internal ID independent of its URL or display name.
- Keep claimed identity, verified ownership, network location, and behavioral identity as separate concepts.
- Prefer established agent-to-agent discovery and interaction protocols.
- Give independently discoverable first-party agents their own public hostnames, routed through a shared gateway when convenient.
- Maintain a registry that can also reference external agents and nonstandard discovery locations.
- Record every discovery step, validation result, rejection, ranking decision, and selected result as events.
- Apply strict network protections, timeouts, size limits, authentication rules, and disclosure policies to external interactions.

## Core Data Concepts

- **Agent:** stable identity, provider claims, endpoints, capabilities, and verification evidence.
- **Scenario:** reproducible world setup, goals, constraints, and success criteria.
- **Run:** one execution of a scenario, search, or interaction.
- **Task:** work requested from one or more agents.
- **Event:** immutable fact, report, simulation output, or derived result within a run.
- **Artifact:** a file or large output created or consumed during a run.
- **Observation:** behavior Skynet can support with recorded evidence.
- **Identity hypothesis:** a versioned conclusion with confidence, evidence, alternatives, and analysis method.
- **Projection:** query-friendly state derived from the event history for a UI or API.

## UI Direction

- The Agentopia side should feel like a small, lively world rather than a conventional dashboard.
- The Skynet side should feel investigative, but remain readable and educational rather than looking like raw logs.
- Selecting an agent, message, task, or moment in either view must update both views.
- Animation should communicate real state changes such as discovery, messages, tool calls, waiting, failure, and completion.
- Users should be able to pause, scrub, filter, and replay the shared timeline.
- Every explanation should allow users to inspect its underlying events and evidence.
- Accessibility and a non-animated representation of important information are required.

## Phases and To-Dos

### Phase 1: Foundation and Vertical Slice

- [ ] Establish the monorepo and independent Agentopia, Skynet, shared-protocol, and Studio boundaries.
- [ ] Define the first version of the activity event envelope and core event types, including schema version, stable IDs, logical time, sequence, causality, provenance/source, and visibility metadata.
- [ ] Represent world interactions as distinct, causally linked proposed-action, resolved-outcome, and delivered-observation events so intent, world state, and each actor's view remain distinguishable.
- [ ] Route scenario, agent, replay, and UI actions through one runtime-validated, server-authoritative command path; use trusted in-process actor contexts in this phase rather than building production authentication.
- [ ] Keep each run's canonical history as an append-only in-memory event stream with a seed, numeric simulated clock, stable tie-breaking, and recorded nondeterministic inputs.
- [ ] Build a deterministic scenario with several scripted agents, deterministic resolvers, and typed environment tools with explicit read-only, state-changing, or observation effects.
- [ ] Define a small interchangeable discovery-policy interface and implement one deterministic filtered/ranked policy that records candidates, validation, rejection reasons, ranking, returned results, and final selection.
- [ ] Derive the Agentopia world, Skynet inspector, selection state, and shared timeline from the same event history and stable identifiers rather than maintaining independent UI state as truth.
- [ ] Implement the combined Studio layout with the world, inspector, and shared timeline.
- [ ] Visualize one complete flow: discover agents, reject and rank candidates, select one, interact, use a tool, verify the result, and replay the run from its event history.
- [ ] Implement one versioned Skynet verifier that emits derived observations linked to the exact supporting or contradicting events.
- [ ] Define artifact references with digest, provenance, visibility, and redaction metadata; use fixture or in-memory artifact storage in this phase and keep sensitive or large content out of ordinary event payloads.
- [ ] Preserve interfaces for task lifecycle events and state reconstruction, but defer durable asynchronous workers, retries, recovery, and persisted checkpoints until later phases.
- [ ] Add fixtures and automated tests that make this demonstration reproducible.
- [ ] Document how to run the vertical slice locally.

### Phase 2: Durable Execution and Observation

- [ ] Persist runs, events, agents, observations, and artifacts.
- [ ] Add live event delivery, run cancellation, timeouts, and failure recovery.
- [ ] Derive UI projections from stored events rather than transient application state.
- [ ] Support pause, timeline scrubbing, event filtering, and deterministic replay.
- [ ] Add structured redaction, visibility rules, provenance, and retention controls.
- [ ] Instrument the platform itself with correlated traces, logs, and metrics.
- [ ] Test interrupted, invalid, slow, and partially completed runs.

### Phase 3: Real Agents and Tools

- [ ] Implement first-party agents behind stable interfaces and publish their discovery metadata.
- [ ] Add adapters for standard agent-to-agent discovery and interaction.
- [ ] Allow external agents to be registered by domain or explicit discovery location.
- [ ] Add safe connections to externally hosted tools and resources.
- [ ] Show protocol negotiation, authentication boundaries, and observable messages in Skynet.
- [ ] Build compatibility and security tests for untrusted external endpoints.
- [ ] Clearly label unavailable internals instead of inventing explanations for external agents.

### Phase 4: Standalone Agentopia and Skynet Use

- [ ] Provide an Agentopia API for loading agents, tools, scenarios, constraints, and success criteria.
- [ ] Make Agentopia scenarios runnable without the Skynet UI, including in automated testing.
- [ ] Provide a small instrumentation SDK and documented event-ingestion API for Skynet.
- [ ] Allow Skynet to import recorded traces and observe systems that do not use Agentopia.
- [ ] Make each UI independently embeddable or runnable while retaining the combined Studio.
- [ ] Validate standalone use cases with real users before creating separate repositories or deployments.

### Phase 5: Behavioral Analysis and Research

- [ ] Define privacy-aware, explainable behavioral features from accumulated observations.
- [ ] Create versioned identity hypotheses with confidence and alternative candidates.
- [ ] Show supporting and contradicting evidence for every inference.
- [ ] Evaluate inference quality against consented ground truth and publish limitations.
- [ ] Provide exportable, redacted datasets and reproducible analysis where appropriate.
- [ ] Add adversarial scenarios for impersonation, manipulation, and unreliable claims.

### Phase 6: Ecosystem and Scale

- [ ] Stabilize public extension, scenario, event, and adapter interfaces.
- [ ] Publish contributor guides and example agents, tools, and integrations.
- [ ] Add isolation and resource limits for untrusted contributed code where needed.
- [ ] Measure real bottlenecks before introducing additional services or infrastructure.
- [ ] Separate deployments or repositories only when users, maintainers, security, release cadence, or scaling needs clearly diverge.

## Definition of a Successful First Release

A visitor can watch Skynet search for agents, understand why candidates were found or rejected, observe agents completing a task, select any visible interaction to inspect its evidence, and replay the full run. The same scenario produces a consistent result, sensitive information is not exposed, and the architecture can accept a real external agent without rewriting the UI or event model.

## Guidance for Future Codex Sessions

- Read this file before proposing structural changes.
- Preserve the Agentopia/Skynet boundary and keep the activity protocol neutral.
- Prefer a thin end-to-end feature over broad unfinished infrastructure.
- Add or update schemas before adding events with unstructured payloads.
- Treat replay, provenance, visibility, and redaction as functional requirements.
- Do not expose hidden reasoning or describe inferred internals as observed facts.
- Avoid adding infrastructure until a measured requirement justifies it.
- Update this plan when a durable product or architectural decision changes; keep temporary implementation notes elsewhere.
