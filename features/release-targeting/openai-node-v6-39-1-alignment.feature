Feature: OpenAI Node SDK v6.39.1 release targeting
  The package release must clearly state and prove the OpenAI Node SDK target
  before release review.

  Scenario: Package metadata targets the official v6.39.1 SDK release
    Given the repository is preparing the NOA-77 release-targeting work
    When maintainers inspect the package metadata
    Then the package version is 6.39.1
    And the openai dependency targets ^6.39.1

  Scenario: Release-facing documentation names the v6.39.1 parity deltas
    Given a maintainer reads the README before release review
    When the README describes the current OpenAI Node SDK alignment
    Then it names OpenAI Node SDK v6.39.1
    And it calls out Responses compact service_tier parity
    And it calls out the admin API expansion
    And it calls out the v6.39.1 SDK patch uptake
    And it preserves the existing Conversations migration warning
