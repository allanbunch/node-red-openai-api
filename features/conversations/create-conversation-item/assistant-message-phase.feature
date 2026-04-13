@conversations @create-conversation-item @phase
Feature: Assistant message phase in Conversations create item requests
  Assistant messages in Conversations create-item requests can carry phase data
  when the upstream OpenAI contract supports it.

  Background:
    Given the Create Conversation Item method uses the upstream items array contract
    And assistant messages are represented as message items in that array

  Scenario: An assistant message can be labeled as commentary
    Given a user prepares an items array with an assistant message
    When the assistant message includes phase set to commentary
    Then the node forwards phase unchanged in the create-item request
    And the help text describes commentary as an allowed assistant-message phase value

  Scenario: An assistant message can be labeled as final_answer
    Given a user prepares an items array with an assistant message
    When the assistant message includes phase set to final_answer
    Then the node forwards phase unchanged in the create-item request
    And the help text describes final_answer as an allowed assistant-message phase value

  Scenario: Follow-up assistant messages preserve phase values
    Given a user sends a follow-up create-item request with prior assistant messages
    When those assistant messages already include phase values
    Then the follow-up request preserves the existing phase values on those assistant messages
    And the published guidance states that dropping assistant-message phase can degrade performance

  Scenario: User messages do not rely on phase guidance
    Given a user prepares an items array with a user message
    When the user reads the Create Conversation Item guidance for phase
    Then the guidance limits phase handling to assistant messages
    And the guidance does not present phase as a required field for user messages
