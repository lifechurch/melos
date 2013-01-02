@javascript
Feature: root page loads without error
  As a user
  I want to the hompage to load without an error
  So that I can use any of the YouVersion.com features


  Background:
  Given I go to the home page

  Scenario: No Rails Errors
    Then I should see "A free Bible on your phone"
    And I should see "God’s word is with you"
