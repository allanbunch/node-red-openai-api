# @inductiv/node-red-openai-api

![NPM Version](https://img.shields.io/npm/v/%40inductiv%2Fnode-red-openai-api)
![GitHub Issues](https://img.shields.io/github/issues/allanbunch/node-red-openai-api)
![GitHub Stars](https://img.shields.io/github/stars/allanbunch/node-red-openai-api)

Node-RED node for calling the OpenAI API (and OpenAI-compatible APIs) through a single configurable node.

This package currently targets `openai` Node SDK `^6.22.0`.

## What You Get

- One `OpenAI API` node with method selection across major API families.
- One `Service Host` config node for base URL, auth, and org settings.
- Typed input support for key config fields: `str`, `env`, `msg`, `flow`, `global` (plus `cred` for API key).
- Backward compatibility handling for older API key storage patterns.
- Built-in examples for common flows.

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
2. In the node editor, use the `Service Host` field to either select an existing config node or create one with the `+` button.
3. In that `Service Host` config, set `API Base` (default: `https://api.openai.com/v1`).
4. Set `API Key`:
   - `cred` type for a masked credential value, or
   - `env/msg/flow/global` and provide a reference name.
5. Back in the `OpenAI API` node, select your method (for example `createModelResponse`).
6. Send request params in `msg.payload` (or change the input property on the node).

Example `msg.payload` for `createModelResponse`:

```json
{
  "model": "gpt-4.1-mini",
  "input": "Write a one-line status summary."
}
```

Node output is written to `msg.payload`.

## Service Host Configuration

### API Key

- `cred` keeps the value in Node-RED credentials (masked in the editor).
- `env/msg/flow/global` treats the field as a reference, not a literal key.
- Existing flows with older key storage formats are still handled.

### Auth Header

- Default behavior is `Authorization`.
- You can override it for OpenAI-compatible providers that use a different header name.

### Organization ID

- Optional.
- Supports typed input (`str/env/msg/flow/global`) like other service fields.

### Environment Variables

You can source values from:

- OS-level environment variables.
- Node-RED editor environment variables (`User Settings -> Environment`).

## Supported API Families

The method dropdown includes operations across:

- Assistants
- Audio
- Batch
- Chat Completions
- Container Files
- Containers
- Conversations
- Embeddings
- Files
- Fine-tuning
- Images
- Messages
- Models
- Moderations
- Responses
- Runs
- Threads
- Uploads
- Vector Store File Batches
- Vector Store Files
- Vector Stores

See the in-editor node help for method-specific payload fields and links to official API docs.

## Recent Additions

- OpenAI Node SDK upgraded from `4.103.0` to `6.22.0`.
- Added `responses.cancel`.
- Added `responses.compact`.
- Added `responses.input_tokens` counting support.
- Added Conversations API support:
  - create/retrieve/modify/delete conversation
  - create/retrieve/list/delete conversation items
- Added Containers and Container Files support.
- Added MCP tool use example flow at `examples/responses/mcp.json`.
- Service Host auth routing now applies `Auth Header` configuration at request time.

## Examples

Import-ready example flows are available in `examples/`:

- `examples/assistants.json`
- `examples/audio.json`
- `examples/chat.json`
- `examples/embeddings.json`
- `examples/files.json`
- `examples/fine-tuning.json`
- `examples/images.json`
- `examples/messages.json`
- `examples/models.json`
- `examples/moderations.json`
- `examples/runs.json`
- `examples/threads.json`
- `examples/responses/mcp.json`

## Development

```bash
npm install
npm run build
npm test
```

Build output files are generated from `src/`:

- `node.html` (from `src/node.html`)
- `lib.js` (from `src/lib.js`)

## Contributing

PRs are welcome. Please include:

- clear scope and rationale,
- tests for behavior changes,
- doc updates when user-facing behavior changes.

## License

[MIT](./LICENSE)
