Feature: Versions view
  In order to: Read the Bible
  As a:        Visitor
  I want to:   See available Bible translations by language
               and learn more information about them.

  Scenario: Listing versions
    When I go to the versions page
    Then I should see "English"
    And I should see a link to "King James Version (KJV)"
    And I should see a link to "The Message (MSG)"
    When I follow "King James Version (KJV)"
    Then I should be on the version page for "1-KJV"

  Scenario: View Version Info
    When I go to the version page for "59-ESV"
    Then I should see "English Standard Version"
    And I should see "Crossway Bibles"
    And I should see "Good News Publishers"
    And I should see "stands in the classic mainstream of English Bible translations over the past half-millennium"

  # Scenario: Path to Read Version
  #   When I go to the version page
  #   And I follow "Read this version"
  #   Then I should be on the bible page "JON.1.59-MSG"
