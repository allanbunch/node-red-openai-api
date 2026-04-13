# BDD Features

This directory holds behavior-first specifications for the Node-RED OpenAI API node.

The layout is organized by API family first, then by node capability or operation.
That keeps each feature set close to the public contract it describes and avoids
mixing unrelated behavior into one large feature file.

Current layout:

- `conversations/` for Conversations-specific behavior
- `step_definitions/` for future executable Cucumber bindings
- `support/` for future shared test helpers and setup

Naming conventions:

- Use one feature file per contract slice or behavior slice.
- Keep file names explicit and operation-focused.
- Keep scenarios written in user-facing contract language, not implementation slang.
- Put cross-cutting setup in `support/` only after step definitions exist.

For future BDD work, prefer this pattern:

- `features/<api-family>/<operation>/<behavior>.feature`

Examples:

- `features/conversations/create-conversation-item/contract-alignment.feature`
- `features/conversations/create-conversation-item/assistant-message-phase.feature`

At this stage these files define the expected behavior and review surface.
Executable step definitions can be added later without moving the feature files.
