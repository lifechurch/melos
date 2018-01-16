
describe('Topic Page', () => {
	before(() => {
		cy.visit('localhost:8001/explore')
		cy.contains('Love')
			.click()
	})

	it('renders correct heading', () => {
		cy.get('h1')
			.contains('what the Bible says about: Love')
	})

	it('renders a verse related to Love', () => {
		cy.get('.verse')
			.should('exist')
	})

	it('renders reading plans related to Love', () => {
		cy.get('.yv-grid')
			.find('a')
			.should('have.attr', 'href')
			.and('include', '/reading-plans/')
	})

	it('it has links to other explore topics', () => {
		cy.contains('Resurrection')
			.should('have.attr', 'href')
			.and('include', '/explore/Resurrection')
		cy.contains('hopeful')
			.should('have.attr', 'href')
			.and('include', '/explore/hopeful')
	})
})
