Feature: Consistent API for accessing and storing data
	As a user of ndb
	I want to have a simple consistent API for accessing data
	So that I can write beautiful code once for multiple environments

	Scenario: Storing data in the bucket
		Given a bucket exists
		When I create a record with data
		And I save that record
		Then I should be able to retrieve that record from its bucket
