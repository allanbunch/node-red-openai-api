@responses @compact-model-response @parity
Feature: Responses compact request-shape parity
  The Compact Model Response method must stay aligned with the upstream Responses
  compact request body while remaining a direct pass-through wrapper.

  Background:
    Given the node exposes the Compact Model Response method
    And that method is implemented as a direct pass-through call to the OpenAI SDK

  Scenario: Prompt cache retention is preserved on compact requests
    Given a user prepares a compact request with prompt_cache_retention
    When the user sets prompt_cache_retention to in_memory
    Then the node forwards prompt_cache_retention unchanged in the compact request
    And the compact help text documents the same in_memory spelling

  Scenario: File input detail is preserved on compact input items
    Given a user prepares a compact request with an input_file item
    When that input_file item sets detail to high
    Then the node forwards input_file.detail unchanged in the compact request
    And local parity coverage proves that behavior without adding compact-specific translation logic

  Scenario: Compact parity evidence stays local and explicit
    Given compact request-shape support is primarily an upstream SDK concern
    When the repo claims support for prompt_cache_retention on compact requests
    Then the repo includes local regression proof for that claim
    And the implementation remains a thin runtime pass-through
