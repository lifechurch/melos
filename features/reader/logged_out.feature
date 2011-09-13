Feature: Logged out Reader view (homepage)
	In order to: Read the Bible
	As an:       Unregistered user
	I want to:   Load a URL pointing to a Bible reference and see the Bible
	             text for that reference in the requested Bible version.

  @live
	Scenario: Show some Bible text
		When I go to the bible page "gen.1.1.kjv"
		Then I should see "Genesis 1" in the main content area
		And I should see "KJV" in the reader toolbar
		And I should see "In the beginning God created the heaven and the earth."

  @allow-rescue
  Scenario: Show a 404 if no Bible reference
    When I go to the bible page ""
    Then I should get a 404 response
