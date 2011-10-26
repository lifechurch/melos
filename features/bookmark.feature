Feature: Bookmarks view (homepage)
  In order to: See the bookmarks I have created
  As a:        User
  I want to:   See a list of bookmarks and links to the Passages they specify

  @bookmark
  Scenario: Showing bookmarks
    Given a user named "cukeuser_bookmark1" with password "tenders" and email "cukeuser_bookmark1@youversion.com" exists
    And the following bookmarks exist:
    | Username | Reference      | Title         | Labels        |
    | testuser | gen.1.1.niv    | The Beginning | old,labeltext |
    | testuser | matt.1.1-5.asv | New Testament | new,gospel    |
    When I go to the bookmarks index page for user "testuser"
    And I should see a link to "The Beginning - Genesis 1:1 (NIV)"
    And I should see "old"
    And I should see "labeltext"
    And I should see a link to "New Testament - Matthew 1:1-5 (ASV)"
    And I should see "gospel"
