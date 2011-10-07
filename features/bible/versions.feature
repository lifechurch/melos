Feature: Versions view
  In order to: Read the Bible
  As a:        Visitor
  I want to:   See available Bible translations by language
               and learn more information about them.

  @live @versions
  Scenario: Listing versions
    When I go to the versions page
    Then I should see "English"
    And I should see a link to "King James Version (KJV)"
    And I should see a link to "The Message (MSG)"
    When I follow "The Message (MSG)"
    Then I should be on the version page for "msg"
    And I should see "The best answer to that question comes from Eugene Peterson himself"
    And I should see a link to "Read This Version"
    When I follow "Read This Version"
    Then I should be on the bible page "gen.1.msg"
    # TODO: swap the Bible page above for last read position when user stuff is in place