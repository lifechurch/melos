import express from 'express'
import bodyParser from 'body-parser'
import { getClient } from '@youversion/js-api'
import { queryifyParamsObj } from './app/lib/routes'

const router = express.Router()
const jsonParser = bodyParser.json()

// pull client secrets from env used for all oauth calls
const clientParams = {
	client_id: process.env.OAUTH_CLIENT_ID,
	client_secret: process.env.OAUTH_CLIENT_SECRET,
}

/**
 * call the oauth endpoint from the server
 * @param  {[object]} params [description]
 * @return {[type]}        [description]
 */
function oauthClientCall(params) {
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
 * get oauth token from user credentials
 * @param  {[string]} [username=null] [description]
 * @param  {[string]} [password=null] [description]
 * @param  {[string]} [facebook=null] [description]
 * @param  {[string]} [google=null]   [description]
 * @return {[promise]}                 [description]
 */
export function getToken({ username = null, password = null, facebook = null, google = null }) {
	let params
	if (username && password) {
		params = Object.assign({ grant_type: 'password' }, clientParams, { username, password })
	} else if (facebook) {
		params = Object.assign({ grant_type: 'password' }, clientParams, { facebook })
	} else if (google) {
		params = Object.assign({ grant_type: 'password' }, clientParams, { google })
	}

	return oauthClientCall(params)
}

/**
 * get an oauth token using a refresh token
 * @param  {[string]} refresh_token [description]
 * @return {[promise]}               [description]
 */
export function refreshToken({ refresh_token }) {
	return oauthClientCall(
		Object.assign({ grant_type: 'refresh_token' }, clientParams, { refresh_token })
	)
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

router.post('/refresh', jsonParser, (req, res) => {
	const { refresh_token } = req.body

	refreshToken({ refresh_token }).then((authResponse) => {
		res.send(authResponse)
	}, (authError) => {
		res.status(401).send(authError)
	})
})

export default router
