import authenticateUser from './authenticateUser'
import { token, decryptToken, decodeToken } from './token'
import tokenDelimiter from './tokenDelimiter'
import expressAuthRouteHandler from './expressAuthRouteHandler'

export default {
	expressAuthRouteHandler,
	authenticateUser,
	token,
	decryptToken,
	decodeToken,
	tokenDelimiter
}
