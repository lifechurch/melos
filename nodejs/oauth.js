import express from 'express'
import bodyParser from 'body-parser'
import { getClient } from '@youversion/js-api'
import { queryifyParamsObj } from './app/lib/routes'

const router = express.Router()
const jsonParser = bodyParser.json()


export function getToken({
	username = null,
	password = null,
	facebook = null,
	google = null
}) {

	let params = {
		client_id: process.env.OAUTH_CLIENT_ID,
		client_secret: process.env.OAUTH_CLIENT_SECRET,
		grant_type: 'password',
	}

	if (username && password) {
		params = Object.assign({}, params, { username, password })
	} else if (facebook) {
		params = Object.assign({}, params, { facebook })
	} else if (google) {
		params = Object.assign({}, params, { google })
	}

	return getClient('auth')
		.call('token')
		.params(queryifyParamsObj(params))
		.setVersion(false)
		.setExtension(false)
		.setEnvironment(process.env.NODE_ENV)
		.setContentType('application/x-www-form-urlencoded')
		.post()
}


/**
	POST https://auth.youversionapistaging.com/token
	POST Body (URL-encoded)
	client_id=<your client ID>
	&client_secret=<your client secret>
	&grant_type=password

	// Password flow
	&username=<user's username>
	&password=<user's password>

	// Google
	&googlejwt=<google jwt token>

	// Facebook
	&facebook=<facebook token>
 */
router.post('/token', jsonParser, (req, res) => {
	const { username, password, facebook, google } = req.body

	getToken({ username, password, facebook, google }).then((authResponse) => {
		res.send(authResponse)
	}, (authError) => {
		res.status(401).send(authError)
	})
})

export default router

// module.exports = router
