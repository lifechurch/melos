Feature: Beta access
  In order to: Access the new beta site
  As a:        Registered user
  I want to:   Sign in with my YV u/p and access the beta site.

  Scenario: Open registration and Persistence
    Given these users exist:
      | username | password | email address           |
      | testuser | tenders  | testuser@youversion.com |
    And the beta is open
    When I go to the versions page
    Then I should be on the beta signup page
    When I fill in "username" with "testuser"
    And I fill in "password" with "tenders"
    And I click "Try the Beta"
    Then I should be on the bible page "gen.1.kjv"
    Given the beta is closed
    When I go to the versions page
    Then I should be on the versions page

  Scenario: closed registration
    Given these users exist:
      | username  | password | email address            |
      | testuser2 | tenders  | testuser2@youversion.com |
    And the beta is closed
    When I go to the versions page
    Then I should be on the beta signup page
    And I should see "Try again soon!"
    And I should not see "username"

