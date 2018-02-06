import express from 'express'
import bodyParser from 'body-parser'
import authenticateUser from './authenticateUser'
import { token } from './token'
import jwt from 'jsonwebtoken'
import constants from './constants'

const router = express.Router()
const jsonParser = bodyParser.json()

router.get('/checkToken', function(req, res) {
	const token = req.headers.authorization.split(' ')[1]
	jwt.verify(token, process.env[constants.TOKEN_PHRASE_ENV_KEY], function(err, decoded) {
		if (err) {
			res.status(401).send("Invalid Token")
		} else {
			res.status(200).send()
		}
	})
})

router.post('/login', jsonParser, function(req, res) {
	const { user, password } = req.body

	authenticateUser(user, password).then(function(authResponse) {
			const { id, first_name, last_name, email, language_tag, timezone, username } = authResponse

			const data = {
				id,
				first_name,
				last_name,
				email,
				language_tag,
				timezone,
				username,
				token: token({
					userid: id,
					email,
					password,
					first_name,
					last_name,
					language_tag,
					timezone,
					username
				})
			}

			res.send(data)

		}, function (authError) {
			res.status(401).send(authError)
		})
})

export default router