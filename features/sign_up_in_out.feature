Feature: Versions view
  In order to: Participate in the YouVersion community
  As a:        Visitor or User
  I want to:   Sign up, sign in, and sign out of my YouVersion account.

  @no_user
  Scenario: New user registration
    # Given a user named "cukeuser2" with password "tenders" does not exist
    When I go to the signup page
    And I fill in "user_username" with "cukeuser2"
    And I fill in "user_email" with "cukeuser2@youversion.com"
    And I fill in "user_password" with "tenders"
    And I check "user_agree"
    And I press "Register"
    Then an unverified user named "cukeuser2" with password "tenders" should exist
    And I should be on the confirm email page

  @user
  Scenario: Sign in/out
    Given a user named "cukeuser3" with password "tenders" and email "cukeuser3@youversion.com" exists
    And I am signed out
    When I go to the sign in page
    And I fill in "username" with "cukeuser3"
    And I fill in "password" with "tenders"
    And I press "Sign in"
    Then I should be on the versions page
    And I should see "cukeuser3"
    And I should see "Sign Out"
    And I should see "Signed in!"