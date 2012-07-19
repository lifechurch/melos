@javascript
Feature: root page loads
  As a user
  I want to the hompage to load without an error
  So that I can use any of the YouVersion.com features


  Background:
  Given I go to the home page

  Scenario: No Rails Errors
    Then I should see "John 1"
    And I should see "In the beginning was the Word"

  # Scenario: No assets issues
  #   #if assets load correctly, we won't see settings menu without a click
  #   Then "Your Settings" should not be visible

  # Scenario: No javascript issues
