const selectVerse = (verseNum) => {
	// force the click in case a dom element is covering
	// a specific verse (i.e. a p tag enveloping multiple verses)
	cy.get(`.v${verseNum}`).first().click({ force: true })
}
/**
 * Test verse actions available on a selected passage of scripture
 *
 * 1. Log in
 * 2. Highlight
 * 3. Bookmark
 * 		- add label
 * 		- add color
 * 4. Note
 * 		- add color
 *
 */
describe('Verse Actions', () => {
	// login before attempting auth-required verse actions
	before(() => {
		cy.fixture('default-login.json').then((auth) => {
			// call custom login function in cypress/support/commands
			cy.login(auth.username, auth.password, '/bible/59/jhn.1.esv')
		})
	})

	// because of the nature of verse actions (ui transitions, network requests, etc)
	// lets wait a bit before trying the next action
	afterEach(() => {
		cy.wait(2000)
	})

	it('highlights jhn.1.1', () => {
		selectVerse(1)
		cy.get('.color-beffaa').last().click()
		cy.get('.v1').should('have.css', { 'background-color': '#beffaa' })
	})

	it('bookmarks jhn.1.5', () => {
		selectVerse(5)
		cy.get('.verse-action-footer').contains('Bookmark').click()
		cy.get('.label-input').find('input').type('new label{enter}')
		cy.contains('Add Color').click()
		cy.get('.bookmark-create').find('.color-fffeca').last().click()
		cy.contains('Save').click()
		cy.get('.v5').should('have.css', { 'background-color': '#fffeca' })
	})

	it('creates a note for jhn.1.10', () => {
		selectVerse(10)
		cy.get('.verse-action-footer').contains('Note').click()
		cy.get('.note-create').find('textarea').type('this test is awesome')
		cy.contains('Add Color').click()
		cy.get('.note-create').find('.color-fffe00').last().click()
		cy.contains('Save').click()
		cy.get('.v10').should('have.css', { 'background-color': '#fffe00' })
	})
})
