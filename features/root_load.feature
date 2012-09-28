@javascript
Feature: root page loads without error
  As a user
  I want to the hompage to load without an error
  So that I can use any of the YouVersion.com features


  Background:
  Given I go to the home page

  Scenario: No Rails Errors
    Then I should see "John 1"
    And I should see "In the beginning was the Word"
    #test that assets load correctly -- we won't see settings menu without a click if css came down
    # And "Your Settings" should not be visible
    # And I should not have any javascript errors
