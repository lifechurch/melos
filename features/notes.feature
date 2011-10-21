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
    And I fill in "Reference" with "gen.1.1" 
    And I select "Public" from the dropdown "status"
    And I click "Save" 
    Then I should be on a show note page
    And I should see "Note Title" 
    And I should see "Note Content" 
    And I should see a link to "Genesis 1:1 (KJV)"
    
  @bible
  Scenario: Update note
    Given a user named "testuser" with password "tenders" exists
    And notes exist with the following attributes:
    | Author    | Title           | Content                 | References  | Status  |
    | testuser  | Public Note     | Public Content          | gen.1.1.kjv | Public  |
    And I am logged in as "testuser" with password "tenders" 
    When I go to the notes index page for user "testuser" 
    Then I should see a link to "Public Note" 
    When I follow "Public Note" 
    Then I should see a link to "edit" 
    When I follow "edit" 
    And I fill in "Title" with "A Different Public Note" 
    And I click "Save" 
    Then I should be on a show note page
    And I should see "A Different Public Note" 
    And I should see "Your note has been updated."
    
  @bible
  Scenario: Delete note
    Given a user named "testuser" with password "tenders" exists
    And notes exist with the following attributes:
    | Author    | Title           | Content                 | References  | Status  |
    | testuser  | Public Note     | Public Content          | gen.1.1.kjv | Public  |
    And I am logged in as "testuser" with password "tenders" 
    When I go to the notes index page for user "testuser" 
    Then I should see a link to "Public Note" 
    When I follow "Public Note" 
    Then I should see a link to "Delete this note" 
    When I follow "Delete this note" 
    # And confirm it somehow
    Then I should be on the notes index page for user "testuser" 
    And I should not see "Public Note"
    
  @bible
  Scenario: Note privacy
    Given a user named "testuser" with password "tenders" exists
    And a user named "testuser2" with password "tenders" exists
    And notes exist with the following attributes:
    | Author    | Title           | Content                 | References  | Status  |
    | testuser  | Public Note     | Public Content          | gen.1.1.kjv | Public  |
    | testuser  | Private Note    | Private Content         | gen.1.2.kjv | Private |
    | testuser2 | Another Public  | Another Public Content  | gen.1.3.kjv | Public  |
    | testuser2 | Another Private | Another Private Content | gen.1.4.kjv | Private |
    And I am logged in as "testuser2" with password "tenders" 
    When I go to the notes index page for user "testuser" 
    Then I should see a link to "Public Note" 
    And I should see "Public Content" 
    And I should not see "Private Note" 
    And I should not see "Private Content" 
    When I go to the notes index page for user "testuser2" 
    Then I should see a link to "Another Public" 
    And I should see "Another Public Content" 
    And I should see a link to "Genesis 1:3 (KJV)" 
    And I should see a link to "Another Private" 
    And I should see a link to "Genesis 1:4 (KJV)" 
    And I should see "Another Private Content"
    
  @bible
  Scenario: Reader integration
    Given a user named "testuser" with password "tenders" exists
    And a user named "testuser2" with password "tenders" exists
    And notes exist with the following attributes:
    | Author    | Title           | Content                 | References  | Status  |
    | testuser  | Public Note     | Public Content          | gen.1.1.kjv | Public  |
    | testuser  | Private Note    | Private Content         | gen.1.2.kjv | Private |
    | testuser2 | Another Public  | Another Public Content  | gen.1.3.kjv | Public  |
    | testuser2 | Another Private | Another Private Content | gen.1.4.kjv | Private |
    And I am logged in as "testuser2" with password "tenders" 
    When I go to the bible page "gen.1.niv" 
    Then I should see the following in the notes widget:
    | Title           |
    | Public Note     |
    | Another Public  |
    | Another Private |