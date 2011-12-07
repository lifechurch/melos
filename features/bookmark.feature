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
    Given a user named "no_bookmarks" exists
    And I have beta access as "no_bookmarks"
    When I go to the versions page
    And I follow "Bookmarks"
    And I should see "add a bookmark"

  Scenario: Browse by label

  Scenario: Pages

