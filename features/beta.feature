Feature: Reader view (homepage)
  In order to: Access the new beta site
  As a:        Registered user
  I want to:   Sign in with my YV u/p and access the beta site.

  Scenario: Open registration
    Given these users:
      | username | password | email address           |
      | testuser | tenders  | testuser@youversion.com |
    And testuser is not signed up for the beta
    And I am signed in as "testuser" with password "tenders"
    And the beta is open
    When I go to the versions page
    Then I should be on the beta signup page
    When I fill in "username" with "testuser"
    And I fill in "password" with "tenders"
    And I click "Try the Beta"
    Then I should be on a bible page
    When I click "Notes"
    Then I should be on my notes page

  Scenario: closed registration
    Given these users:
      | username  | password | email address            |
      | testuser2 | tenders  | testuser2@youversion.com |
    And testuser2 is not signed up for the beta
    And I am signed in as "testuser2" with password "tenders"
    And the beta is closed
    When I go to the versions page
    Then I should be on the beta signup page
    And I should see "Sorry"
    And I should not see "username"

  Scenario: closed registration
    Given these users:
      | username  | password | email address            |
      | testuser3 | tenders  | testuser3@youversion.com |
    And testuser3 is signed up for the beta
    And I am signed in as "testuser3" with password "tenders"
    And the beta is closed
    When I go to the versions page
    Then I should be on the versions page
