@conversations @create-conversation-item @contract
Feature: Create Conversation Item contract alignment
  The Create Conversation Item method must match the upstream OpenAI
  Conversations API contract exactly.

  Background:
    Given the OpenAI SDK version targeted by this work is 6.34.x
    And the node exposes the Create Conversation Item method

  Scenario: The request payload uses the upstream items array contract
    Given a user selects the Create Conversation Item method in the node UI
    When the user supplies a payload with a conversation_id and an items array
    Then the documented request contract describes items as an array
    And the node passes the items array to the OpenAI Conversations items.create call unchanged

  Scenario: The published contract does not advertise a singular item payload
    Given the Create Conversation Item method is documented for users
    When a user reads the in-editor help and example material for that method
    Then the published contract describes items as the payload field
    And the published contract does not describe a singular item payload for Create Conversation Item

  Scenario: The examples follow the same create-item contract as the help text
    Given the repository publishes example flows for the Conversations surface
    When a user imports the Create Conversation Item example flow
    Then the example uses the items array contract
    And the example matches the in-editor help for Create Conversation Item
