Feature: Logged out Reader view (homepage)
	In order to: Read the Bible
	As an:       Unregistered user
	I want to:   Load a URL pointing to a Bible reference and see the Bible
	             text for that reference in the requested Bible version.

  @live
	Scenario: Show some Bible text
		When I go to the bible page "gen.1.niv"
		Then I should see "Genesis 1" in the main content area
		And I should see "NIV" in the reader toolbar
		And I should see "In the beginning God created the heavens and the earth."
		And I should see "Biblica, Inc. Used by permission. All rights reserved worldwide."
		And I should see a version dropdown with options "King James Version (KJV)", "The Message (MSG)", "New Century Version (NCV)"
		And NIV should be selected in the version dropdown

  @allow-rescue
  Scenario: Show a 404 if no Bible reference
    When I go to the bible page ""
    Then I should get a 404 response
