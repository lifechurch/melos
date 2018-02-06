import * as crypto from 'crypto'
import jwt from 'jsonwebtoken'
import constants from './constants'

export function token(tokenData) {
	const tokenPhrase = process.env[constants.TOKEN_PHRASE_ENV_KEY]

	if (typeof tokenPhrase === 'undefined') {
		throw new Error('Invalid token phrase. It should be set as an ENV variable.')
	}

	const tokenDataString = JSON.stringify(tokenData)
	const cipher = crypto.createCipher('aes-256-cbc', tokenPhrase)
	let crypted = cipher.update(tokenDataString, 'utf8', 'hex')
	crypted += cipher.final('hex')

	return jwt.sign(
		{ token: crypted },
		tokenPhrase,
		{
			issuer: "http://bible.com",
			expiresIn: 24 * 60 * 60
		}
	)
}

export function decodeToken(token) {
	return jwt.verify(token, process.env[constants.TOKEN_PHRASE_ENV_KEY])
}

export function decryptToken(tokenData) {
	const tokenPhrase = process.env[constants.TOKEN_PHRASE_ENV_KEY]

	if (typeof tokenPhrase === 'undefined') {
		throw new Error('Invalid token phrase. It should be set as an ENV variable.')
	}

	const decipher = crypto.createDecipher('aes-256-cbc', tokenPhrase)
	let dec = decipher.update(tokenData, 'hex', 'utf8')
	dec += decipher.final('utf8')
	return JSON.parse(dec)
}