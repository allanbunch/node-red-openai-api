# @inductiv/node-red-openai-api

![NPM Version](https://img.shields.io/npm/v/%40inductiv%2Fnode-red-openai-api)
![GitHub Issues](https://img.shields.io/github/issues/allanbunch/node-red-openai-api)
![GitHub Stars](https://img.shields.io/github/stars/allanbunch/node-red-openai-api)

This project brings the OpenAI API, and OpenAI-compatible APIs, into Node-RED as workflow-native building blocks.

It is not just a thin wrapper around text generation. The node exposes modern AI capabilities inside a runtime people can inspect, route, test, and operate: request and response workflows, tools, conversations, streaming, realtime interactions, webhooks, and related API families that matter in real systems.

That makes this repository relevant beyond Node-RED alone. It is a practical implementation of how contemporary AI capabilities can live inside an open workflow environment instead of being locked inside a single vendor surface or hidden behind a one-purpose abstraction.

This package currently targets the `openai` Node SDK `^6.32.0`.

## Why This Exists

Modern AI work is no longer just "send a prompt, get a string back."

Real systems now involve:

- tool use
- multi-step workflows
- structured payloads
- streaming responses
- realtime sessions
- webhook verification
- provider compatibility and auth routing

Node-RED is already good at orchestration, automation, event handling, integration, and operational clarity. This project connects those strengths to the OpenAI API surface so teams can build AI workflows in an environment that stays visible and composable.

## Core Model

The node model in this repository is intentionally simple:

- one `OpenAI API` node handles the runtime method call
- one `Service Host` config node handles API base URL, auth, and organization settings
- the selected method determines which OpenAI API context is being called
- request data is passed in through a configurable message property, `msg.payload` by default
- method-specific details live in the editor help, example flows, and the underlying SDK contract

In practice, that means one node can cover a wide API surface without turning the flow itself into a maze of special-purpose nodes.

## What It Enables

### Request and Response Workflows

Use the node for direct generation, structured Responses API work, chat-style interactions, moderation, embeddings, image work, audio tasks, and other request/response patterns.

That includes speech work with built-in voices or a saved custom voice id, depending on what the flow needs.

### Video and Sora Workflows

Use the node for OpenAI video work inside Node-RED, including current Sora video methods for generation, remix, edit, extend, character creation, and downloadable video assets. That lets video features live in the same visible, routable workflow environment as the rest of your AI system.

### Tool-Enabled and Multi-Step AI Flows

Use Responses tools, conversations, runs, messages, vector stores, files, skills, and related resources as part of larger control loops and operational workflows. Use ChatKit sessions and threads when a published Agent Builder workflow needs to be exposed cleanly inside a Node-RED flow.

### Streaming and Realtime Work

Use streamed Responses output, Realtime client-secret creation, SIP call operations, and persistent Responses websocket connections where a flow needs more than one-shot request handling.

### Event-Driven Integrations

Use webhook signature verification and payload unwrapping in Node-RED flows that react to upstream platform events.

### OpenAI-Compatible Provider Support

Use the `Service Host` config to target compatible API providers with custom base URLs, custom auth header names, query-string auth routing, and typed configuration values.

## Requirements

- Node.js `>=18.0.0`
- Node-RED `>=3.0.0`

## Install

### Node-RED Palette Manager

```text
@inductiv/node-red-openai-api
```

### npm

```bash
cd $HOME/.node-red
npm i @inductiv/node-red-openai-api
```

## Quick Start

1. Drop an `OpenAI API` node onto your flow.
2. Create or select a `Service Host` config node.
3. Set `API Base` to your provider endpoint. The default OpenAI value is `https://api.openai.com/v1`.
4. Set `API Key` using either:
   - `cred` for a stored credential value, or
   - `env`, `msg`, `flow`, or `global` for a runtime reference
5. Pick a method on the `OpenAI API` node, such as `create model response`.
6. Send the request payload through `msg.payload`, or change the node's input property if your flow uses a different message shape.

Example `msg.payload` for `create model response`:

```json
{
  "model": "gpt-5.4-mini",
  "input": "Write a one-line status summary."
}
```

The node writes its output back to `msg.payload`.

## Start Here

If you want to understand the shape of this node quickly, these example flows are the best entry points:

- [`examples/chat.json`](examples/chat.json)
  A straightforward API-call flow for getting oriented.
- [`examples/chatkit/sessions-and-threads.json`](examples/chatkit/sessions-and-threads.json)
  Shows how to create and cancel ChatKit sessions for a published Agent Builder workflow, then inspect the resulting threads and thread items.
- [`examples/responses/phase.json`](examples/responses/phase.json)
  A clean Responses example using newer payload features.
- [`examples/responses/tool-search.json`](examples/responses/tool-search.json)
  Shows tool-enabled Responses work in a practical flow.
- [`examples/responses/computer-use.json`](examples/responses/computer-use.json)
  Shows the request and follow-up contract for computer-use style workflows.
- [`examples/responses/websocket.json`](examples/responses/websocket.json)
  Shows explicit websocket lifecycle handling in one node instance.
- [`examples/videos.json`](examples/videos.json)
  Shows the current video flow surface, including create, character creation, edit, extend, remix, and asset download.
- [`examples/vector-store-search.json`](examples/vector-store-search.json)
  Shows direct vector-store search with `ComparisonFilter` `in` and `nin` operators.
- [`examples/realtime/client-secrets.json`](examples/realtime/client-secrets.json)
  Shows the Realtime client-secret contract for browser or mobile handoff.

## Current Alignment Highlights

This repository currently includes:

- ChatKit / Agent Builder support, including session creation and cancellation, plus thread and thread-item inspection for published workflows
- Responses API support, including current SDK-typed model ids such as `gpt-5.4-mini`, `gpt-5.4-nano`, and dated variants like `gpt-5.4-mini-2026-03-17`, plus `phase`, `prompt_cache_key`, `tool_search`, GA computer-use payloads, parse and stream helpers, cancellation, compaction, input-token counting, and websocket mode
- Vector Stores support, including direct vector-store search, vector-store file attribute updates, parsed file-content retrieval, and file-attribute filters using `ComparisonFilter` operators such as `in` and `nin`
- Realtime API support, including client-secret creation, SIP call operations, and current SDK-typed model ids such as `gpt-realtime-1.5` and `gpt-audio-1.5`
- Audio speech support with built-in voices and saved custom voice ids
- Videos / Sora support, including generation, remix, edit, extend, character creation, and downloadable assets
- Conversations, Containers, Container Files, Evals, Skills, and Webhooks support
- OpenAI-compatible auth routing through the `Service Host` config node

See the in-editor node help for exact method payloads and links to official API documentation.

## API Surface

The method picker covers a wide range of OpenAI API families:

- Assistants
- Audio
- Batch
- Chat Completions
- ChatKit
- Container Files
- Containers
- Conversations
- Embeddings
- Evals
- Files
- Fine-tuning
- Images
- Messages
- Models
- Moderations
- Realtime
- Responses
- Runs
- Skills
- Threads
- Uploads
- Vector Store File Batches
- Vector Store Files
- Vector Stores
- Videos
- Webhooks

`Graders` are supported through Evals payloads via `testing_criteria`, in the same way the official SDK models them.

## Example Index

Import-ready example flows live under `examples/`:

- [`examples/assistants.json`](examples/assistants.json)
- [`examples/audio.json`](examples/audio.json)
- [`examples/chat.json`](examples/chat.json)
- [`examples/chatkit/sessions-and-threads.json`](examples/chatkit/sessions-and-threads.json)
- [`examples/embeddings.json`](examples/embeddings.json)
- [`examples/files.json`](examples/files.json)
- [`examples/fine-tuning.json`](examples/fine-tuning.json)
- [`examples/images.json`](examples/images.json)
- [`examples/messages.json`](examples/messages.json)
- [`examples/models.json`](examples/models.json)
- [`examples/moderations.json`](examples/moderations.json)
- [`examples/realtime/client-secrets.json`](examples/realtime/client-secrets.json)
- [`examples/responses/computer-use.json`](examples/responses/computer-use.json)
- [`examples/responses/mcp.json`](examples/responses/mcp.json)
- [`examples/responses/phase.json`](examples/responses/phase.json)
- [`examples/responses/tool-search.json`](examples/responses/tool-search.json)
- [`examples/responses/websocket.json`](examples/responses/websocket.json)
- [`examples/videos.json`](examples/videos.json)
- [`examples/vector-store-search.json`](examples/vector-store-search.json)
- [`examples/runs.json`](examples/runs.json)
- [`examples/threads.json`](examples/threads.json)

## Service Host Notes

The `Service Host` config node handles the provider-specific runtime boundary.

- `API Key` supports `cred`, `env`, `msg`, `flow`, and `global`
- `API Base` can point at OpenAI or a compatible provider
- `Auth Header` defaults to `Authorization`, but can be changed for provider-specific auth conventions
- auth can be sent either as a header or as a query-string parameter
- `Organization ID` is optional and supports typed values like the other service fields

This is the piece that lets one runtime model work cleanly across both OpenAI and compatible API surfaces.

## Repository Shape

This repository is structured so the runtime, editor, examples, and generated artifacts stay understandable:

- [`node.js`](node.js)
  Node-RED runtime entry point and `Service Host` config-node logic.
- [`src/`](src)
  Source modules for method implementations, editor templates, and help content.
- [`src/lib.js`](src/lib.js)
  Source entry for the bundled runtime method surface.
- [`lib.js`](lib.js)
  Generated runtime bundle built from `src/lib.js`.
- [`src/node.html`](src/node.html)
  Source editor template that includes the per-family fragments.
- [`node.html`](node.html)
  Generated editor asset built from `src/node.html`.
- [`examples/`](examples)
  Import-ready Node-RED flows.
- [`test/`](test)
  Node test coverage for editor behavior, auth routing, method mapping, and websocket lifecycle behavior.

## Development

```bash
npm install
npm run build
npm test
```

Generated files are part of the project:

- `node.html` is built from `src/node.html`
- `lib.js` is built from `src/lib.js`

If you change source templates or runtime source files, rebuild before review or release.

## Support

This project is maintained against the live OpenAI platform, which means real ongoing costs for API usage, testing, parity work, and release verification, especially when newer features and newer models need to be exercised properly.

If this package is useful to you or your team, support through [GitHub Sponsors](https://github.com/sponsors/allanbunch) helps keep that work moving.

## Contributing

Contributions are welcome. Keep changes clear, intentional, and proven.

Please include:

- a clear scope and rationale
- tests for behavior changes
- a short plain-language comment block at the top of each test file you add or touch
- doc updates when user-facing behavior changes

## License

[MIT](./LICENSE)
