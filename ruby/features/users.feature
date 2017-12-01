Feature: Users Functionality
  In order to: Keep track of my activity on YouVersion
  As a:        Visitor
  I want to:   View my own and other users' information.

  Background:
    Given these users exist:
    | Username   | First Name | Last Name  | Location   | Web Site              |
    | useruser   | User       | User       | Austin, TX | http://www.google.com |
    | userfriend | User       | Friend     | Edmond, OK | http://www.yahoo.com  |
    And I have beta access as "useruser"
    And these notes exist:
    | Author     | Title           | Content                 | References       | Status  |
    | useruser   | Public Note     | Public Content          | exod.1.1.kjv     | Public  |
    | useruser   | Private Note    | useruser Private Content| exod.1.2.kjv     | Private |
    | userfriend | Another Public  | Another Public Content  | exod.1.3.kjv     | Public  |
    | userfriend | Another Private | Another Private Content | exod.1.4.kjv     | Private |
    And the following bookmarks exist:
    | Username   | Reference      | Title         | Labels        |
    | useruser   | gen.1.1.niv    | The Beginning | old,labeltext |
    | userfriend | matt.1.1-5.asv | New Testament | new,gospel    |

  Scenario: Viewing my profile
    When I go to the versions page
    And I follow "Profile"
    # Profile info
    Then I should see "User User"
    And I should see "Austin, TX"
    And I should see "http://www.google.com"
    # TODO: Avatar?
    # Recent Content
    And I should see "Recent Activity"
    And I should see "Public Content"
    And I should see "The Beginning"
    # Settings links
    And I should see "Edit Profile"
    And I should see "Change Password"
    # Badges
    # And I should see "Created a Bookmark"
    
  Scenario: Editing my profile
    When I go to the versions page
    And I follow "Profile"
    And I follow "Edit Profile"
    And I fill in "First name" with "foo"
    And I fill in "Last name" with "bar"
    And I click "Update Profile"
    Then I should see "You have successfully updated your profile."

  Scenario: Changing my password
    When I go to the versions page
    And I follow "Profile"
    And I follow "Change Password"
    And I fill in "Current Password" with "tenders"
    And I fill in "New Password" with "tenders2"
    And I fill in "Confirm Password" with "tenders2"
    And I click "Change My Password"
    Then a user named named "useruser" with password "tenders2" should exist
    When I fill in "Current Password" with "tenders2"
    And I fill in "New Password" with "tenders"
    And I fill in "Confirm Password" with "tenders"
    And I click "Change My Password"
    Then a user named named "useruser" with password "tenders" should exist

  @wip
  Scenario: Updating my Picture
    # TODO: This seems wonky. I think maybe I'm confusing the API.
    #

  Scenario: Updating Notifications
    When I go to the sign in page
    And I follow "Profile"
    And I follow "Manage Notifications"
    Then "Notify me about badges I've earned" should be checked
    And "Notify me when someone follows me" should be checked
    When I click "Notify me about badges I've earned"
    And I click "Update Notifications"
    Then I should see "You have successfully"
    And "Notify me about badges I've earned" should not be checked
    And "Notify me when someone follows me" should be checked
    When I click "Notify me about badges I've earned"
    And I click "Update Notifications"
    Then I should see "You have successfully"
    And "Notify me about badges I've earned" should be checked
    And "Notify me when someone follows me" should be checked