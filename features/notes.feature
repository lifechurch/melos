Feature: Notes view
  In order to: Create a Note
  As a:        User
  I want to:   Create a new note and save it

  Background:
    Given these users exist:
      | username | password | email address           |
      | testuser | tenders  | testuser@youversion.com |
    And I have beta access as "testuser", "tenders"
  @notes
  Scenario: Create note
    Given a user named "testuser" exists
    And I am logged in as "testuser"
    When I go to the new note page
    And I fill in "Title" with "Public Note 1" 
    And I fill in "note_content" with "Public Content 1" 
    And I select "King James Version" from the dropdown "note_version"
    And I fill in "Reference" with "gen.1.1" 
    And I select "Public" from the dropdown "note_user_status"
    And I click "Save" 
    Then I should be on a show note page
    And I should see "Public Note 1" 
    And I should see "Public Content 1" 
    And I should see a link to "Genesis 1:1 (KJV)"
    
  @notes
  Scenario: Update note
    Given a user named "testuser" exists
    And these notes exist:
    | Author    | Title           | Content                 | References  | Version | Status  |
    | testuser  | Public Note 2   | Public Content          | gen.1.1     | kjv     | Public  |
    And I am logged in as "testuser"
    When I go to the notes index page
    Then I should see a link to "Public Note" 
    When I follow "Public Note 2" 
    Then I should see a link to "edit" 
    When I follow "edit" 
    And I fill in "Title" with "A Different Public Note" 
    And I click "Save" 
    And I should see "A Different Public Note" 
    And I should see "Your note has been updated."
    
  @notes
  Scenario: Delete note
    Given a user named "testuser" exists
    And these notes exist:
    | Author    | Title           | Content                 | References  | Version | Status  |
    | testuser  | Delete Me       | Public Content          | gen.1.1     | kjv     | Public  |
    And I am logged in as "testuser"
    When I go to the notes index page
    And I follow "Delete Me" 
    Then I should see a link to "delete this note" 
    When I follow "delete this note" 
    # And confirm it somehow
    Then I should be on the notes index page
    And I should not see "Delete Me"
    
  @notes
  Scenario: Note privacy
    Given a user named "testuser" exists
    And a user named "testuser2" exists
    And these notes exist:
    | Author    | Title           | Content                 | References  | Version | Status  |
    | testuser  | Public Note     | Public Content          | gen.1.1     | kjv     | Public  |
    | testuser  | Private Note    | testuser Private Content| gen.1.2     | kjv     | Private |
    | testuser2 | Another Public  | Another Public Content  | gen.1.3     | kjv     | Public  |
    | testuser2 | Another Private | Another Private Content | gen.1.4     | kjv     | Private |
    And I am logged in as "testuser"
    When I go to the notes index page
    Then I should see a link to "Public Note" 
    And I should see "Public Content" 
    And I should not see "Another Private" 
    And I should not see "Another Private Content"
    Then I should see a link to "Another Public" 
    And I should see "Another Public Content" 
    And I should see a link to "Genesis 1:3 (KJV)" 
    And I should see a link to "Private Note" 
    And I should see "testuser Private Content"
    
  @notes
  Scenario: Reader integration
    Given a user named "testuser" exists
    And a user named "testuser2" exists
    And these notes exist:
    | Author    | Title           | Content                 | References   | Version | Status  |
    | testuser  | Public Note     | Public Content          | exod.1.1     | kjv     | Public  |
    | testuser  | Private Note    | testuser Private Content| exod.1.2     | kjv     | Private |
    | testuser2 | Another Public  | Another Public Content  | exod.1.3     | kjv     | Public  |
    | testuser2 | Another Private | Another Private Content | exod.1.4     | kjv     | Private |
    And I am logged in as "testuser2"
    When I go to the bible page "exod.1.niv" 
    Then I should see the following in the notes widget:
    | Title           |
    | Public Note     |
    | Another Public  |
    | Another Private |
