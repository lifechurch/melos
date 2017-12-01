@javascript
Feature: Reader view (homepage)
  In order to interact with the Bible
  As a user
  I want to view scripture, change from one scripture reference to another,
  view publisher reference notes, change the version of the scripture,
  highlight, bookmark, notate, and share verses.

  @skip
  Scenario: Showing some Bible text
    # Given a bookmark on Genesis 1:3
    # And a note on Genesis 1:5
    When I go to the bible page "gen.1.niv"
    Then I should see "Genesis 1" in the main content area
    # And I should see "NIV" in the reader toolbar
    And I should see "In the beginning God created the heavens and the earth."
    And I should see "Biblica, Inc. Used by permission. All rights reserved worldwide."
    # And i should see related bookmarks
    # and i should see related notes

  Scenario: Changing the value of the version selector
    When I go to the bible page "gen.1.niv"
    Then I should see "King James Version" within the version selector
    And I should see "The Message" within the version selector
    And I should see "New Century Version" within the version selector
    # And "NIV" should be selected within the version selector
    # When I follow "Douay Rheims" within the version selector
    # Then I should be on the bible page "gen.1.dra"
    # And "DRA" should be selected within the version selector
    # And I should see "Tobit" within the book selector

  Scenario: Selecting a book and chapter
    When I go to the bible page "gen.1.niv"
    #Then "Gen" should be selected within the book selector
    Then I should not see "Tobit" within the book selector
    # because it's Apocryphal
    And I should not see "51" within the chapter selector
    # because it has 50 chapters
    When I go to the bible page "exod.1.niv"
    Then I should not see "41" within the chapter selector
    # because Exodus has 40 chapters
    When I go to the bible page "gen.1.dra"
    # Then "Gen" should be selected within the book selector
    Then I should see "Tobit" within the book selector
    # because it's in the Apocrypha