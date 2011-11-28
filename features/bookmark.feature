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
    | Username | Reference      | Title         | Labels        |
    | cukeuser_bookmark1 | gen.1.1.niv    | The Beginning | old,labeltext |
    | cukeuser_bookmark1 | matt.1.1-5.asv | New Testament | new,gospel    |
    When I go to the versions page
    And I follow "Bookmarks"
    Then I should see a link to "The Beginning - Genesis 1:1 (NIV)"
    And I should see "old"
    And I should see "labeltext"
    And I should see a link to "New Testament - Matthew 1:1-5 (ASV)"
    And I should see "gospel"

  @bookmark
  Scenario: Showing my bookmarks
    Given a user named "cukeuser_bookmark1" with password "tenders" and email "cukeuser_bookmark1@youversion.com" exists
    And the following bookmarks exist:
    | Username | Reference      | Title         | Labels        |
    | cukeuser_bookmark1 | gen.1.1.niv    | The Beginning | old,labeltext |
    | cukeuser_bookmark1 | matt.1.1-5.asv | New Testament | new,gospel    |
    And I am logged in as "cukeuser_bookmark1" with password "tenders"
    When I go to my bookmarks
    Then I should see a link to "The Beginning - Genesis 1:1 (NIV)"
    And I should see a link to "old"
    And I should see a link to "labeltext"
    And I should see a link to "New Testament - Matthew 1:1-5 (ASV)"
    And I should see a link to "gospel"
    When I click "old"
    Then I should not see "New Testament"
