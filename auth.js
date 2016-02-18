import express from 'express'
import bodyParser from 'body-parser'
import Jwt from 'jsonwebtoken'
import jwt from 'express-jwt'
import { getClient, buildToken } from '@youversion/js-api'

const router = express.Router()
const jsonParser = bodyParser.json()

router.post('/authenticate', jsonParser, function(req, res) {
	const { user, password } = req.body
	authenticate(user, password).then((authResponse) => {
		const { id } = authResponse
		viewUser(id, user, password).then((viewResponse) => {
			const { first_name, last_name, email, language_tag, timezone } = viewResponse
			const data = {
				first_name,
				last_name,
				email,
				language_tag,
				timezone,
				token: buildToken({
					email: email,
					userid: id,
					password: password
				})
			}

			res.send(data)

		}, (viewError) => {
			res.status(401).send(viewError)
		})

	}, (authError) => {
		res.status(401).send(authError)
	})
})

function authenticate(user, password) {
	return getClient('users')
		.call('authenticate')
		.setVersion('3.1')
		.setEnvironment('staging')
		.auth(user, password)
		.post()
}

function viewUser(id, user, password) {
	return getClient('users')
		.call('view')
		.setVersion('3.1')
		.setEnvironment('staging')
		.params({ id })
		.auth(user, password)
		.get()
}

module.exports = router