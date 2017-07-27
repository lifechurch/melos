import express from 'express'
import bodyParser from 'body-parser'
import { getClient } from '@youversion/js-api'

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

	// convert query: { redirect: true } to route?redirect=true
	const queryParams = Object.keys(params).reduce((acc, key) => {
		const val = params[key]
		return `${acc}${key}=${val}&`
	}, '')


	return getClient('auth')
		.call('token')
		// .params('client_id=28edb8be359c01567cb8c30b6db672d5&client_secret=b7921f3afdffa373e29814a2ce70b40c&grant_type=password&username=JacobAllenwood&password=Ninjasrus')
		.params('client_id=1f14150f46cd3afd775f25b6e8f38388&client_secret=57ab16ce722551da397a12d9d60f01cc&grant_type=password&username=cv01&password=password')
		.setVersion(false)
		.setExtension(false)
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
