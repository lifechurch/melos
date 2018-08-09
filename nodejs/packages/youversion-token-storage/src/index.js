import cookie from 'react-cookie'

const TOKEN_STORAGE_KEY = 'YouVersionToken2'
const TOKEN_MAX_AGE = 60 * 60 * 24

export function fetchToken() {
	return cookie.load(TOKEN_STORAGE_KEY)
}

export function storeToken(token, maxAge = TOKEN_MAX_AGE) {
	const windowHasHostname = (window && window.location && window.location.hostname && window.location.hostname !== 'localhost')
	const domain = windowHasHostname
    ? [''].concat(window.location.hostname.split('.').splice(-2)).join('.')
    : null
	cookie.save(TOKEN_STORAGE_KEY, token, { domain, path: '/', maxAge })
}

export function deleteToken() {
	cookie.remove(TOKEN_STORAGE_KEY)
}
