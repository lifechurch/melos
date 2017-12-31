const selectVerse = (verseNum) => {
	cy.get(`.v${verseNum}`).first().click({ force: true })
}

describe('Verse Actions', () => {
	// login first
	before(() => {
		cy.fixture('default-login.json').then((auth) => {
			cy.login(auth.username, auth.password, '/bible/59/jhn.1.esv')
		})
	})

	it('highlights jhn.1.1', () => {
		selectVerse(1)
		cy.get('.color-beffaa').click()
		cy.get('.v1').should('have.css', { 'background-color': '#beffaa' })
	})

	it('bookmarks jhn.1.5', () => {
		selectVerse(5)
		cy.get('.verse-action-footer').contains('Bookmark').click()
	})
})
