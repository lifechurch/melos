Feature: Notes view
  In order to: Create a Note
  As a:        User
  I want to:   Create a new note and save it

  @bible
  Scenario: Create note
    Given a user named "testuser" with password "tenders" exists
    And I am logged in as "testuser" with password "tenders" 
    When I go to the new note page
    And I fill in "Title" with "Note Title" 
    And I fill in "Content" with "Note Content" 
    And I select "King James Version" from the dropdown "version"
    And I fill in "Reference" with "Genesis 1:1" 
    And I select "Public" from the dropdown "status"
    And I click "Save" 
    Then I should be on a show note page
    And I should see "Note Title" 
    And I should see "Note Content" 
    And I should see a link to "Genesis 1:1 (KJV)" 