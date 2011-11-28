Feature: Reading Plans view
  In order to: Work with a reading plan
  As a:        User
  I want to:   View, subscribe to, or make progress in a reading plan

  Background:
    Given these users exist:
      | username | password | email address           |
      | testuser | tenders  | testuser@youversion.com |
    And I have beta access as "testuser", "tenders"
    
  Scenario: Plan page with filterable plan list
    Given a user named "testuser" exists
    And a user named "testuser2" exists
    And I am logged in as "testuser"
    When I go to the reading plans index page
    Then I should see a link to "Public Note" 
    And I should see "Public Content" 
    And I should not see "Another Private" 
    And I should not see "Another Private Content"
    Then I should see a link to "Another Public" 
    And I should see "Another Public Content" 
    And I should see a link to "Genesis 1:3 (KJV)" 
    And I should see a link to "Private Note" 
    And I should see "testuser Private Content"