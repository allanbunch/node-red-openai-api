# Responses Features

This area describes the public Responses behavior of the node.

Keep Responses scenarios grouped by operation so parity work can add new proof
slices without mixing create, stream, compact, and retrieval behavior together.

Current operation folders:

- `create-model-response/` for create and stream request-shape parity proof
- `compact-model-response/` for compact request-shape parity proof

When future work adds more Responses coverage, prefer sibling folders such as:

- `get-model-response/`
- `stream-model-response/`
- `manage-model-response-websocket/`

That keeps the feature hierarchy stable as the Responses surface grows.