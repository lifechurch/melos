Feature: Bookmarks view (homepage)
  In order to: See the bookmarks I have created
  As a:        User
  I want to:   See a list of bookmarks and links to the Passages they specify

  Background:
  Given a user named "cukeuser_bookmark1" exists
  And I have beta access as "cukeuser_bookmark1"

  @bookmark
  Scenario: Showing bookmarks
    Given the following bookmarks exist:
    | Username           | Reference      | Title         | Labels        |
    | cukeuser_bookmark1 | gen.1.1.niv    | The Beginning | old,labeltext |
    | cukeuser_bookmark1 | matt.1.1-5.asv | New Testament | new,gospel    |
    When I go to the versions page
    And I follow "Bookmarks"
    Then I should see "The Beginning"
    And I should see a link to "Matthew 1:1-5 (ASV)"
    And I should see "old"
    And I should see "labeltext"
    And I should see "New Testament"
    And I should see "gospel"
    When I follow "Matthew 1:1-5 (ASV)"
    Then I should be on the bible page "matt.1.asv"

  Scenario: No bookmarks
    Given a user named "emptyuser" exists
    And I have beta access as "emptyuser"
    When I go to the versions page
    And I follow "Bookmarks"
    And I should see "add a bookmark"
    When I go to the bible page "gen.1.niv"
    Then I should not see "Recent Bookmarks"


  Scenario: Browse by label

  Scenario: Pages
    Given a user named "lotsa_bookmarks" exists
    And I have beta access as "lotsa_bookmarks"
    And "lotsa_bookmarks" has 50 bookmarks with the title "test bookmark"
    When I go to the versions page
    And I follow "Bookmarks"
    Then I should see "#29 test bookmark"
    And I should see "#30 test bookmark"
    And I should not see "#1 test bookmark"
    And I should not see "#2 test bookmark"
    When I follow "Next Page"
    Then I should see "#1 test bookmark"
    And I should see "#2 test bookmark"
    And I should not see "#29 test bookmark"
    And I should not see "#30 test bookmark"


