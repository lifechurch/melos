import cookie from 'react-cookie'

const TOKEN_STORAGE_KEY = 'YouVersionToken'
const TOKEN_MAX_AGE = 60 * 60 * 24

export function fetchToken () {
	return cookie.load(TOKEN_STORAGE_KEY)
}

export function storeToken(token, maxAge = TOKEN_MAX_AGE) {
	cookie.save(TOKEN_STORAGE_KEY, token, { path: '/', maxAge })
}

export function deleteToken() {
	cookie.remove(TOKEN_STORAGE_KEY)
}