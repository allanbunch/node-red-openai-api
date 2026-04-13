# Conversations Features

This area describes the public Conversations behavior of the node.

Keep Conversations scenarios grouped by operation so future parity work can add
new slices without rewriting existing features.

Current operation folders:

- `create-conversation-item/` for create-item contract behavior and message-phase behavior

When future work adds more Conversations coverage, prefer sibling folders such as:

- `create-conversation/`
- `retrieve-conversation-item/`
- `list-conversation-items/`

That keeps the feature hierarchy stable as the Conversations surface grows.