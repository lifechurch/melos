
describe('Explore Page', () => {
	before(() => {
		cy.visit('localhost:8001/explore')
	})

	it('has links for topic', () => {
		cy.contains('Love')
			.should('have.attr', 'href')
			.and('include', '/explore/Love')
	})

	it('has links for emotion', () => {
		cy.get('a[title="happy"]')
			.click()
		cy.contains('joyful')
			.should('have.attr', 'href')
			.and('include', '/explore/joyful')
	})

	it('has a link to Bible Stories', () => {
		cy.contains('Bible Stories')
			.should('exist')
	})

	it('has verse images and links to scripture', () => {
		cy.get('.yv-grid')
			.find('a')
			.should('have.attr', 'href')
			.and('include', '/bible/')
	})
})
