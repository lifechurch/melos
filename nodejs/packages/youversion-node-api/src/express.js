const express = require('express'),
	api = require('./api').api,
	bodyParser = require('body-parser'),
	urlencodedParser = bodyParser.json(),
	router = express.Router(),
	jwt = require('express-jwt'),
	tokenPhrase = process.env.YOUVERSION_TOKEN_PHRASE,
	decryptToken = require('./tokenAuth/token').decryptToken,
	tokenDelimiter = require('./tokenAuth/tokenDelimiter');

const NODE_ENV = (typeof process.env.NODE_ENV === 'undefined') ? 'production' : process.env.NODE_ENV
const YOUVERSION_TP_TOKEN_NAME = 'youversion-tp-token'

/**
 * splitJwtTpTokens - when using 3rd-party auth, the Authorization header will
 * 										contain the encrypted JWT concatenated with the token from
 *										the 3rd-party provider. Storing them this way prevents us
 *										from encrypting a token that's already encrypted elsewhere
 *
 * @param  {string} authHeader the current Authorization HTTP header
 * @return {object}            an object with two keys, jwtToken and tpToken
 */
function splitJwtTpTokens(authHeader) {
	let [ jwtToken, tpToken ] = authHeader.split(tokenDelimiter)
	if (typeof tpToken !== 'undefined' && tpToken !== null && tpToken !== '') {
		tpToken = tpToken.replace('Facebook+', 'Facebook ').replace('GoogleJWT+', 'GoogleJWT ')
	} else {
		tpToken = null
	}
	return { jwtToken, tpToken }
}



/**
 * Middleware to check for presence of authorization header and split out the
 *  JWT and 3rd-Party Auth Tokens (if necessary) into separate headers
 */
router.use((req, res, next) => {
	const authHeader = req.headers.authorization
	if (typeof authHeader === 'undefined') {
		next();
	} else {
		const { jwtToken, tpToken } = splitJwtTpTokens(authHeader)

		req.headers.authorization = jwtToken

		if (tpToken !== null) {
			req.headers[YOUVERSION_TP_TOKEN_NAME] = tpToken
		}

		next();
	}
})

router.options('/api_auth/:section/:noun/:version', (req, res) => {
	res.append('Access-Control-Allow-Origin', '*');
	res.append('Access-Control-Allow-Methods', '*');
	res.append('Access-Control-Allow-Headers', '*');
	res.status(200).send();
});

/**
 * YV API proxy for GET requests that don't
 *  require authentication
 */
router.get('/api/:section/:noun/:version',
	(req, res) => {
		api(req.params.section, req.params.noun, req.query, false, 'json', 'GET', req.params.version, NODE_ENV).then((data) => {
			res.send(data);
		}, (err) => {
			res.status(500).send({ err });
		});
	});

/**
 * YV API proxy for GET requests that
 *  require authentication
 */
router.get('/api_auth/:section/:noun/:version',
	jwt({ secret: tokenPhrase }),
	(req, res) => {
		const userData = decryptToken(req.user.token);
		const tp_token = req.headers[YOUVERSION_TP_TOKEN_NAME]

		let auth = null;

		if (userData.email && userData.password) {
			auth = { username: userData.email, password: userData.password };
		} else if (tp_token) {
			auth = { tp_token }
		} else if (userData.tp_token) {
			auth = { tp_token: userData.tp_token }
		} else {
			return res.status(401).send('Not authorized for this API.');
		}

		api(req.params.section, req.params.noun, req.query, auth, 'json', 'GET', req.params.version, NODE_ENV).then((data) => {
			res.send(data);
		}, (err) => {
			res.status(500).send({ err });
		});
	});

/**
 * YV API proxy for POST requests that don't
 *  require authentication
 */
router.post('/api/:section/:noun/:version', urlencodedParser, (req, res) => {
	api(req.params.section, req.params.noun, req.body, false, 'json', 'POST', req.params.version, NODE_ENV).then((data) => {
		res.send(data);
	}, (err) => {
		res.status(500).send({ err });
	});
});

/**
 * YV API proxy for POST requests that
 *  require authentication
 */
router.post('/api_auth/:section/:noun/:version',
	jwt({ secret: tokenPhrase }),
	urlencodedParser,
	(req, res) => {
		const userData = decryptToken(req.user.token);
		const tp_token = req.headers[YOUVERSION_TP_TOKEN_NAME]

		let auth = null;

		if (userData.email && userData.password) {
			auth = { username: userData.email, password: userData.password };
		} else if (tp_token) {
			auth = { tp_token }
		} else if (userData.tp_token) {
			auth = { tp_token: userData.tp_token }
		} else {
			return res.status(401).send('Not authorized for this API.');
		}

		api(req.params.section, req.params.noun, req.body, auth, 'json', 'POST', req.params.version, NODE_ENV).then((data) => {
			res.send(data);
		}, (err) => {
			res.status(500).send({ err });
		});
	}
);

module.exports = router;
