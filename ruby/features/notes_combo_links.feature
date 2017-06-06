Feature: Community/My Notes combo links
  In order to: Navigate between Community Notes & My Notes
  As a: Authenticated user
  I want to: Sign in with my YV u/p and navigate to my notes
			
  Scenario: Display Notes Pill
    Given a user named "testuser" exists
    And I am logged in with "testuser"
	When I click the notes icon in the main nav
	Then I should not be redirected
	And I should be on 'my notes' page
	And I should see a pill in the top right to get to 'community notes', with 'my notes' slected
	When I click 'community notes'
	Then I should be on the community notes page
	And I should see the pill in the top right with 'community notes' selected.

  Scenario: Don't Display Notes Pill
	Given I'm not logged in as a user
	When I click the notes icon in the main nav
	Then I should be on the 'community notes' page
	And I should not see a pill in the top right to get to 'my notes'
