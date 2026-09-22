## Existing List
* https://github.com/microsoft/multi-agent-marketplace
* https://github.com/tsinghua-fib-lab/agentsociety?utm_source=chatgpt.com
* https://github.com/google-deepmind/concordia
* https://github.com/a16z-infra/ai-town

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
