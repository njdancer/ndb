Feature: Data Persistence

  Scenario: data persists across sessions
    Given a bucket exists
    When I create a record with data
    And I save that record
    And I create a bucket
    Then I should be able to retrieve that record from the bucket
