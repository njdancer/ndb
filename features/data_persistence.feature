Feature: Data Persistence

  Scenario: data persists across sessions
    Given a bucket exists
    When I create a record with data
    And I create a bucket
    And I should be able to retrieve that record from the bucket
