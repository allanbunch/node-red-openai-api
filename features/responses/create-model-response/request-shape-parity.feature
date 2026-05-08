@responses @create-model-response @parity
Feature: Responses create and stream request-shape parity
  The Create Model Response and Stream Model Response methods must expose the
  current upstream Responses request shape without adding local translation logic.

  Background:
    Given the node exposes the Create Model Response and Stream Model Response methods
    And those methods are implemented as direct pass-through calls to the OpenAI SDK

  Scenario: File input detail is preserved on create requests
    Given a user prepares a Responses create payload with an input_file item
    When that input_file item sets detail to high
    Then the node forwards input_file.detail unchanged in the create request
    And the published help text describes input_file detail as part of the Responses input contract

  Scenario: Web-search include values and top logprobs are preserved on create requests
    Given a user prepares a Responses create payload with a web_search tool
    When the payload includes web_search_call.results and message.output_text.logprobs
    And the payload sets top_logprobs to 3
    Then the node forwards those fields unchanged in the create request
    And the example and help material describe the same field names for users

  Scenario: Streamed create requests use the same newer request fields
    Given a user starts a streamed Responses request without a response_id
    When the payload includes input_file.detail, web_search_call.results, prompt_cache_retention, and top_logprobs
    Then the stream helper forwards the same request body unchanged to the SDK stream helper
    And the published guidance states that streamed create requests use the same request body shape as create

  Scenario: Prompt cache retention keeps the upstream spelling
    Given a user sets prompt_cache_retention on a Responses request
    When the user chooses the in_memory retention policy
    Then the node forwards in_memory unchanged to the SDK
    And the repo-owned Responses guidance keeps that field on the upstream in_memory spelling

  Scenario: Local parity evidence is required even when runtime work is a no-op
    Given the Responses create and stream methods are already direct pass-through wrappers
    When newer SDK request fields are added upstream
    Then the repo still adds local docs, examples, and regression proof for those fields
    And the work does not introduce request-rewriting logic that the runtime does not need
