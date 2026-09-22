## Existing List
* https://github.com/microsoft/multi-agent-marketplace
* https://github.com/tsinghua-fib-lab/agentsociety?utm_source=chatgpt.com
* https://github.com/google-deepmind/concordia
* https://github.com/a16z-infra/ai-town

## Selected to Consider

- Model every interaction as a causal chain of proposed action, resolved outcome, and delivered observation *(Concordia)*.
  - **How:** Define linked, versioned events such as `action.proposed`, `action.resolved`, and `observation.delivered`, all carrying run, trace, span, causal-parent, source, visibility, and logical-time metadata.
  - **Why:** This is the clearest foundation for Skynet: it prevents an agent's intention, the world's decision, and another agent's limited view from being mistaken for one another, while making explanations and replay trustworthy.

- Build deterministic execution around an append-only event history and replaceable checkpoints *(AgentSociety and Concordia)*.
  - **How:** Use a seeded scheduler with a numeric simulated clock, stable tie-breaking, and recorded nondeterministic inputs; keep events canonical and store snapshots separately for fast pause/resume, validating that state can be rebuilt from history.
  - **Why:** Replayability is a defining product promise, and establishing determinism early avoids retrofitting it after timers, concurrency, LLM calls, and external agents make runs difficult to reproduce.

- Make discovery decisions observable through an interchangeable policy interface *(Multi-Agent Marketplace)*.
  - **How:** Start with simple deterministic and filtered discovery policies, but emit events for candidates considered, filters, validation, scores, ranking, rejection reasons, the returned set, and final selection; retain an oracle policy only for evaluation.
  - **Why:** Agent discovery is central to the first-release story, and exposing the entire selection path gives Skynet unusually valuable evidence rather than showing only a polished final answer.

- Put all human, agent, and scheduled actions through one authenticated command path *(AI Town)*.
  - **How:** Define runtime-validated command unions; persist intent with command ID, actor, sequence, idempotency key, and causal IDs before execution; then append accepted/rejected and terminal outcome events after permission and invariant checks.
  - **Why:** A single server-authoritative path prevents spoofing and hidden state mutations, makes failures inspectable, and lets the same scenario work consistently from the UI, an agent, a test, or a replay.

- Separate fast world simulation from slow external work with durable task state machines *(AI Town)*.
  - **How:** Keep deterministic world mutations synchronous per run, while representing LLM, tool, and remote-agent work as `scheduled`, `started`, `completed`, `failed`, `timed_out`, or `cancelled` tasks whose results re-enter through commands and events with idempotent retries.
  - **Why:** This boundary keeps the world responsive and replayable even when real integrations are slow or unreliable, without prematurely introducing distributed infrastructure.

- Encapsulate world capabilities in typed environment modules with explicit effects *(AgentSociety)*.
  - **How:** Create a small TypeScript `EnvironmentModule` contract for lifecycle, snapshot/restore, and tool manifests; classify tools as read-only, state-changing, per-agent observation, or aggregate statistics, and wrap calls with policy, timeout, redaction, and lifecycle events.
  - **Why:** This provides a clean extension point for tools and scenarios while preserving Agentopia's ownership of world state and giving Skynet consistent evidence about what was requested and what actually changed.

- Drive the world, inspector, and replay controls from the same event-derived projections *(Multi-Agent Marketplace, AgentSociety, and AI Town)*.
  - **How:** Stream shared read models without polling, synchronize selection by stable IDs and event time, and make any selected actor, message, task, or event update the world snapshot, causal trace, evidence view, and replay position together.
  - **Why:** This interaction is the core Studio differentiator: users can move fluidly between an approachable animated world and the exact evidence behind what they see.

- Use scripted agents and deterministic resolvers as the first vertical-slice fixtures *(Concordia)*.
  - **How:** Implement one compact scenario covering discovery, rejection, selection, interaction, tool use, verification, and replay; lock its seed and expected invariants, then replace scripted components with LLM or external agents one boundary at a time.
  - **Why:** A deterministic reference run makes UI work, schema evolution, regression testing, and later comparisons credible without letting model variability obscure platform defects.

- Make verification a versioned, evidence-producing Skynet capability *(Multi-Agent Marketplace)*.
  - **How:** Add checks for nonexistent actors, invented items, incorrect prices or totals, invalid transitions, and unmet success criteria; emit each result as a derived `Observation` linked to supporting and contradicting events and the analysis-method version.
  - **Why:** Verification turns the system from a trace viewer into an analysis tool, demonstrates the distinction between facts and inference, and produces measurable outcomes for future experiments.

- Treat sensitive or large content as protected artifacts rather than ordinary event payloads *(Concordia)*.
  - **How:** Store prompts, outputs, files, and repeated context by digest; reference them from events with integrity, provenance, visibility, redaction, retention, and access metadata, while showing explicitly when details are unavailable.
  - **Why:** This preserves a useful causal record without leaking credentials, private reasoning, or oversized content, and it gives first-party and external-agent observations the same honest security model.

## Inspirations

### microsoft/multi-agent-marketplace

- Reuse its MIT-licensed synthetic marketplace datasets and scenario variants: small-to-large restaurant/contractor markets, position bias, consideration-set size, persuasive descriptions, and prompt injection.
  - Convert the YAML fixtures into Agentopia scenarios; begin with `mexican_3_9`, then run controlled variants against the same agents and goals. Preserve the upstream MIT notice for copied or substantially derived material.

- Borrow its small typed interaction vocabulary: search, fetch messages, send text, submit an order proposal, and make a payment.
  - Implement these as versioned TypeScript discriminated unions in the shared activity protocol, using runtime schemas that also generate JSON Schema.

- Borrow its discoverable action-protocol pattern, where actions expose a name, description, and parameter schema.
  - Let agents/adapters advertise supported actions, but record protocol retrieval, negotiation, validation, and rejection as neutral activity events.

- Borrow its interchangeable discovery strategies: simple, filtered, lexical, retrieval-and-ranking, and optimal/oracle search.
  - Define a common discovery-policy interface; emit an event for every candidate considered, score/rank, filter, rejection reason, result set, and final selection. Use the oracle policy as evaluation ground truth, not as a production search mode.

- Borrow its structured post-run verification of proposals, including nonexistent actors, invented items, incorrect prices, and incorrect totals.
  - Implement each check as a versioned Skynet analysis method that produces a derived `Observation` linked to the exact supporting and contradicting events.

- Borrow its experiment methodology for measuring position bias, manipulation, model differences, welfare, completion, and failure rates.
  - Express each experiment as a reproducible scenario matrix with fixed fixtures, explicit variables, seeds, success criteria, and exportable aggregate projections.

- Borrow its agent lifecycle and orchestration ideas: registration, repeated steps, concurrent actors, bounded primary agents, dependent agents, graceful shutdown, and provider concurrency limits.
  - Put lifecycle control behind Agentopia's scheduler and simulated clock; emit lifecycle events and record all nondeterministic inputs so runs can be paused and replayed deterministically.

- Borrow its portable experiment export and read-model approach, but not its database schema.
  - Keep the canonical store as an append-only event history, derive query/UI projections from it, and export a redacted portable run bundle (for example SQLite plus referenced artifacts).

- Borrow the visualizer's synchronized participant selection and conversation-centric presentation, but not its polling architecture.
  - Drive Agentopia and Skynet views from the same live event stream and shared timeline; selecting an actor, message, task, or event should update the world, inspector, evidence, and replay position together.

- Use its Python implementation as a reference fixture rather than as Agentopia's core runtime.
  - Port only the useful contracts, datasets, algorithms, and validation rules into the TypeScript modular monolith; optionally add an adapter later to ingest an exported marketplace run as external observed data.

- Do not inherit its security, trace, or replay limitations.
  - Authenticate the execution context rather than trusting a caller-supplied agent ID; prevent sender spoofing; persist intent before execution and append success/failure afterward; include run/trace/span/causal IDs, schema version, logical time, provenance, source, and visibility; redact prompts, responses, credentials, and private reasoning by default.

### tsinghua-fib-lab/AgentSociety

- Borrow its environment-module boundary: modules own world state and expose typed tools classified as read-only, state-changing, per-agent observation, or aggregate statistics.
  - Define a small TypeScript `EnvironmentModule` contract with lifecycle, snapshot/restore, and tool-manifest methods; enforce tool effects and emit requested/started/completed/failed events around every call.

- Borrow its scenario-step DSL for advancing time, asking agents questions, applying interventions, and running questionnaires.
  - Model scenario commands as versioned discriminated unions with explicit targets, simulated timestamps/ticks, expected effects, success criteria, and generated activity events.

- Borrow its strict separation between replay data and recovery checkpoints.
  - Keep append-only events as the canonical history for Skynet/replay; maintain separately replaceable Agentopia snapshots for fast pause/resume, and rebuild snapshots from events when validating determinism.

- Borrow its metadata-rich replay catalog: dataset kind, entity/step/time keys, default ordering, capabilities, versions, and semantic column metadata.
  - Attach comparable metadata to projections and export bundles so Studio can build timelines, maps, tables, and charts without hard-coding every scenario; do not let projection datasets replace the neutral event protocol.

- Borrow its OpenTelemetry-compatible trace hierarchy and lightweight span attributes.
  - Put `traceId`, `spanId`, `parentSpanId`, status, timing, and sequence directly into or alongside shared activity events; use the same identifiers across events, traces, logs, and artifacts so Skynet can reconstruct causality without joining unrelated histories heuristically.

- Borrow its workspace-backed agent model, which separates stable agent specifications and persisted state from short-lived runtime instances.
  - Give each first-party agent a serializable snapshot and stable identity independent of its process; start Phase 1 in-process, but preserve an interface that later permits worker reconstruction, isolation, and interruption recovery.

- Borrow its injected service container/proxy boundary between agents and environment, model, trace, replay, and storage services.
  - Pass narrow capability interfaces into agent runtimes instead of global clients; wrap them with policy, authentication, redaction, timeout, and event-emission middleware.

- Borrow its interchangeable reasoning/router strategies: ReAct, plan-execute, code generation, hierarchical routing, and tool search.
  - Define a router-policy interface and record routing inputs, visible candidate tools, selection, validation, execution, and outcome; implement one simple deterministic policy first and add other strategies only as controlled experiments.

- Borrow its metadata-first, selected-only skill loading and module registry concepts.
  - Discover extensions from small manifests before loading implementation details; version capabilities and compatibility requirements, activate only selected extensions, and run untrusted contributed code in an isolated worker rather than dynamically importing it into the control plane.

- Reuse or adapt its social simulations as Agentopia scenario fixtures: prisoner’s dilemma, public-goods, trust, reputation, commons tragedy, mobility/disaster, and event-based daily activity.
  - Port the smallest deterministic cases first, capture expected invariants and seeded inputs, then use interventions and questionnaires to compare behavioral outcomes without treating self-reports as observed facts.

- Borrow its replay API/UI query shapes: experiment summary, dataset catalog, agent profiles, timeline, per-step bundle, entity/time filters, and latest state per entity.
  - Build Studio read APIs from Skynet projections and cancel stale scrub requests; selecting a time or entity should return a synchronized world snapshot plus the underlying events and evidence.

- Borrow its run-directory/export organization for portable research artifacts.
  - Package manifest/configuration, event history, projection schemas, redacted artifacts, checkpoints, and analysis-method versions together so a run can be inspected offline and its provenance verified.

- Defer its scale machinery until measurements justify it.
  - Do not begin with Ray tasks/actors, hundreds of JSONL shards, DuckDB views, adaptive distributed concurrency, or multiple router implementations; retain compatible boundaries while using the planned TypeScript modular monolith and a simple durable store.

- Do not expose workspace memory, tool transcripts, generated code, prompts, or model reasoning as automatically observable truth.
  - Classify each datum as simulated, observed, reported, or derived; apply visibility and redaction before ingestion, store sensitive detail as protected artifacts when necessary, and show unavailable internals honestly.

- Reuse AgentSociety 2 code only under its Apache-2.0 obligations and avoid assuming legacy subtrees have identical terms.
  - Prefer conceptual ports or isolated adapters; for copied/modified v2 code, retain the license and attribution notices, mark modified files, review any applicable `NOTICE`, and exclude the legacy v1 commercial area unless separately cleared.

### google-deepmind/concordia

- Borrow its Game Master separation between an agent's intended action, the world's resolved outcome, and the observations delivered to each actor.
  - Represent these as distinct linked events such as `action.proposed`, `action.resolved`, and `observation.delivered`; label resolver output as `simulated` or `derived`, never as an externally observed fact.

- Borrow its minimal entity interface: an entity has an identity, receives observations, and produces an action constrained by an action specification.
  - Keep Agentopia's first-party agent contract small and framework-neutral; put memory, planning, tools, and model-specific behavior behind adapters rather than requiring them in the public agent interface.

- Borrow its typed action specifications for free text, enumerated choices, and numeric responses, including validation before world mutation.
  - Define versioned action/request schemas with allowed values, bounds, tags, and validation errors; persist invalid attempts and rejection reasons so Skynet can explain why an action did not occur.

- Borrow its compositional entity-component model and explicit lifecycle phases around acting and observing.
  - Let first-party agents assemble independently testable components for instructions, observation, memory, planning, and action selection; expose only approved component outputs as events and keep private reasoning private.

- Borrow its deterministic world-authority role while treating LLM-based resolution as an optional policy.
  - Resolve rules, permissions, inventory, payments, movement, and tool effects with deterministic code when possible; if an LLM interprets an ambiguous action, record the model, prompt policy/version, confidence, alternatives, and evidence used.

- Borrow both sequential and simultaneous execution semantics.
  - Make scheduling policy explicit per scenario or scene: sequential actions resolve before the next actor observes, while simultaneous actions remain hidden until the batch closes and are resolved together.

- Borrow its scene model for changing participants, rules, action spaces, premises, round limits, world authority, and simulated start time during one run.
  - Define scenes as serializable scenario segments and emit scene-entered/exited events so Studio can group the shared timeline into understandable chapters or phases.

- Borrow its interrupt-driven scheduler: timestamped ordered events, per-agent attention masks, private pending observations, timers, and event-triggered activation.
  - Use a deterministic priority queue with stable tie-breaking; model subscriptions as explicit delivery policy, record filtered/deferred/delivered decisions, and use timers instead of polling inactive agents.

- Borrow its separation of deterministic time arithmetic from human-facing time narration.
  - Keep Agentopia's canonical clock numeric and replayable; derive readable labels for Studio separately so generated narration can never change scheduling order.

- Borrow its prefab/recipe layer above atomic components.
  - Offer versioned agent, world-authority, and scenario templates that expand into explicit component manifests; store the expanded manifest and versions in every run so convenience does not hide provenance.

- Reuse or adapt its scripted, puppet, mock-model, questionnaire, game-theory, resource-dilemma, signaling, social-media, negotiation, and deceptive/upselling scenarios.
  - Use scripted agents and deterministic resolvers as Phase 1 fixtures and regression oracles; later substitute LLM agents one boundary at a time and compare behavior against the same seeded scenario.

- Borrow its component-level state serialization, checkpoints, and play/pause/single-step control.
  - Require serializable first-party component state, checkpoint only at defined event boundaries, and let Studio controls issue commands whose effects are also recorded on the shared timeline.

- Borrow its content-addressed storage for repeated large log content and embedded artifacts.
  - Store large prompts, outputs, images, and repeated context once by cryptographic digest and reference them from events, while applying visibility, redaction, integrity, retention, and access metadata to each artifact.

- Borrow associative retrieval as an agent-memory implementation, not as platform truth.
  - Record memory writes and visible retrieval references when policy permits, including embedding/model/version and ranking metadata; never treat retrieved or generated memories as verified world events.

- Borrow its structured human and machine log views, but derive them from the event history.
  - Generate summaries, HTML exports, component views, and agent-focused queries as Skynet projections; avoid maintaining a separate nested log format that can diverge from canonical events.

- Do not let a Game Master or component log blur claims, hidden cognition, simulated outcomes, and observations.
  - Give world authorities limited declared capabilities, preserve the proposed action separately, show resolution rules/evidence, and apply source/visibility labels before anything reaches Skynet or another agent.

- Reuse Concordia code only under its Apache-2.0 obligations.
  - Prefer conceptual TypeScript ports or an external-run adapter; for copied or modified code, retain license and attribution notices, mark modified files, include any applicable `NOTICE`, and do not reuse Google/DeepMind trademarks as project branding.

### a16z-infra/ai-town

- Consider PixiJS as Agentopia's renderer, while treating AI Town's visual design and component tree only as references.
  - Use PixiJS if the chosen design needs a large 2D scene, many animated entities, layers, or camera zoom/pan; build Agentopia's own art direction, scene graph, interactions, and design system, and use React/CSS/SVG instead if the final world is small or primarily interface-like.

- Borrow only style-independent rendering techniques, not AI Town's UI foundation.
  - Reimplement camera/viewport management, render layers, animation, entity selection, and interpolation against Agentopia's event-derived projections; consult or extract small pieces of `PixiViewport` or related components only when that is simpler than writing them cleanly for Studio.

- Reuse MIT-licensed generic TypeScript utilities only when an implemented feature creates a concrete need.
  - Geometry and min-heap code may help with navigation; adapt pathfinding only for a compatible grid; defer compression until profiling justifies it. Copy isolated modules and tests rather than importing the application, preserve the MIT notice, remove Convex coupling, and add Agentopia-specific tests.

- Borrow its single typed input path shared by humans and agents.
  - Define versioned command discriminated unions with runtime validation; authenticate the actor separately, check permissions and world invariants, and append linked accepted/rejected and outcome events instead of allowing UI or workers to mutate world state directly.

- Borrow its monotonically sequenced inputs and subscribable success/error results.
  - Persist each command before execution with a command ID, per-run sequence, idempotency key, logical/received time, actor, run/trace/span IDs, and causal parent; let clients await its terminal result through the live event stream.

- Borrow its server-authoritative, serialized executor and generation-number protection against stale scheduled work.
  - Start with one logical writer per run; require scheduled callbacks to present the current generation/lease, make stale callbacks no-op, and record cancellation or supersession so replay preserves the decision.

- Borrow its distinction between high-frequency simulation ticks and lower-frequency durable commits.
  - Keep movement/collision interpolation inside a deterministic simulation projection, while emitting canonical events only for meaningful transitions such as move requested, path chosen, blocked, arrived, conversation joined, or task completed; never store 60-fps rendering updates as domain events.

- Borrow the idea behind `HistoricalObject`, `useHistoricalTime`, and `useHistoricalValue` only if event-derived animation is observably choppy.
  - Begin with a small interpolation buffer over world projections; adopt AI Town's compressed numeric-history implementation only if measurements justify its complexity. Keep the buffer disposable: Studio pause/scrub/replay must rebuild from canonical events and checkpoints rather than treating interpolation history as truth.

- Borrow its explicit conversation lifecycle and spatial transition states: invited, walking over, participating, typing, leaving, and archived.
  - Implement a validated state machine that emits every request, rejection, transition, message, and end reason; enforce participant/visibility rules and correlate messages with the conversation, actors, and causal command.

- Borrow its separation of fast synchronous world logic from slow asynchronous LLM or external operations.
  - Represent slow work as a durable task state machine (`scheduled`, `started`, `completed`, `failed`, `timed_out`, `cancelled`) with retries and idempotency; results must return through commands/events, and per-agent concurrency should be an explicit scenario policy rather than a hard-coded global limit of one.

- Borrow its conversation-memory pipeline: summarize an interaction, score importance, embed it, retrieve by relevance/recency/importance, and create reflections linked to source memories.
  - Keep memory as a private, replaceable agent projection; link summaries/reflections to source events, label them `reported` or `derived`, record model/embedder/prompt/ranker versions and retrieval scores, and never treat generated recollection as platform truth.

- Borrow its hot-state separation: compact active worlds, separate maps/descriptions, archived entities/conversations, a relationship graph, and independently stored high-volume messages.
  - Keep the append-only event store canonical; build a small active-world projection, derive interaction graphs such as `participatedTogether`, and place large or frequently updated content in projections/artifacts referenced by events with visibility and retention metadata.

- Borrow its deterministic grid movement, collision avoidance, and pathfinding budgets/timeouts only if Agentopia's chosen world design uses spatial navigation.
  - For a grid-based Phase 1, use a simple seeded map and emit requested destination, resolved route, blocked/replanned, and arrived events; otherwise omit pathfinding. Treat the bundled JavaScript editors as references rather than part of the foundation.

- Borrow its reactive client flow, where world updates, command completion, character selection, and conversation UI update without polling.
  - Subscribe Studio to live event-derived read models, keep Agentopia and Skynet selection synchronized by stable IDs and event time, and hide the transport behind an interface rather than coupling the architecture to Convex.

- Do not copy its persistence and operational shortcuts as the platform architecture.
  - Avoid loading and rewriting an entire world each step, wall-clock/random behavior without captured seeds, direct message mutations outside the event protocol, destructive data resets for configuration changes, and assumptions that a single-threaded Convex world provides durable replay or scale; use migrations, checkpoints, recorded nondeterminism, and append-only events instead.

- Reuse AI Town code only with its MIT notice, and audit visual/audio assets separately.
  - Preserve the repository license for copied code, but verify every tileset, sprite, font, UI asset, and generated/music asset against its original license and attribution terms; replace unclear assets and do not reuse a16z, Convex, or AI Town branding.
