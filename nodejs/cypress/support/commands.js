
Cypress.Commands.add('login', (username, password, redirect = null) => {
	Cypress.log({
		name: 'login',
		message: `${username} | ${password}`
	})

	cy.visit(`localhost:8001/sign-in${redirect ? `?redirect=${redirect}` : ''}`)
	cy.get('#username').type(username)
	cy.get('#password').type(password)
	cy.get('button[type=submit]').click()
})
