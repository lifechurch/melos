import express from 'express'
import bodyParser from 'body-parser'
import { getClient } from '@youversion/js-api'
import queryifyParamsObj from '@youversion/utils/lib/routes/queryifyParamsObj'

const router = express.Router()
const jsonParser = bodyParser.json()

// pull client secrets from env used for all oauth calls
const secretParams = {
  client_id: process.env.OAUTH_CLIENT_ID,
  client_secret: process.env.OAUTH_CLIENT_SECRET,
}

function encode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
    return `%${c.charCodeAt(0).toString(16)}`
  })
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
 * @param  {[string]} [googlejwt=null]   [description]
 * @return {[promise]}                 [description]
 */
export function getToken({ username = null, password = null, facebook = null, googlejwt = null, scopes = null }) {
  let params
  if (username && password) {
    params = Object.assign({ grant_type: 'password' }, secretParams, { username, password })
  } else if (facebook) {
    params = Object.assign({ grant_type: 'password' }, secretParams, { facebook })
  } else if (googlejwt) {
    params = Object.assign({ grant_type: 'password' }, secretParams, { googlejwt })
  }

  if (scopes) {
    params = Object.assign({}, params, { scope: scopes })
  }

  // encode the values to be passed to oauth
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach((parmesan) => {
      params[parmesan] = encode(params[parmesan])
    })
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
    Object.assign({ grant_type: 'refresh_token' }, secretParams, { refresh_token })
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
  const { username, password, facebook, googlejwt, scopes } = req.body

  getToken({ username, password, facebook, googlejwt, scopes }).then((authResponse) => {
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
