import { getClient } from '@youversion/js-api'
import { push } from 'react-router-redux'
import RavenNode from 'raven'

import ActionCreators from '../features/Auth/actions/creators'

const endpoints = [
  'events',
  'search',
  'users',
  'bible',
  'reading-plans',
  'moments',
  'audio-bible',
  'friends',
  'messaging',
  'notifications',
  'streaks',
  'friendships',
  'localization',
  'images'
]
const versions = [ '3.2', '3.1' ]
const envs = [ 'staging', 'production' ]
const http_methods = [ 'get', 'post' ]

let Raven = (typeof Raven === 'undefined') ? null : Raven
if (typeof window === 'undefined') {
  Raven = RavenNode
}


function getRequestAction(type, action) {
  const finalAction = Object.assign({}, action, { ...action, type })
  delete finalAction.api_call
  return finalAction
}

function getFailureAction(type, action, api_errors) {
  if (!Array.isArray(api_errors)) {
    api_errors = [ api_errors ]
  }
  const finalAction = Object.assign({}, action, { api_errors, type })
  delete finalAction.api_call
  return finalAction
}

function getSuccessAction(type, action, response) {
  const finalAction = Object.assign({}, action, { response, type })
  delete finalAction.api_call
  return finalAction
}

export default store => {
  return next => {
    return action => {
      const api_call = action.api_call

      if (typeof api_call === 'undefined') {
        return next(action)
      }

      const endpoint = api_call.endpoint
      if (typeof endpoint !== 'string' || endpoints.indexOf(endpoint) === -1) {
        throw new Error(`Invalid API Endpoint [${endpoint}]`)
      }

      const method = api_call.method
      if (typeof method !== 'string') {
        throw new Error('API method must be string')
      }

      const version = api_call.version
      if (typeof version !== 'string' || versions.indexOf(version) === -1) {
        throw new Error(`Invalid API Version [${version}]`)
      }

      let env = api_call.env
      if (typeof env !== 'string' || envs.indexOf(env) === -1) {
        env = envs[0]
      }

      const params = api_call.params
      if (typeof params !== 'object') {
        throw new Error('Invalid API params')
      }

      const http_method = api_call.http_method
      if (typeof http_method !== 'string' || http_methods.indexOf(http_method) === -1) {
        throw new Error('Invalid API HTTP Method')
      }

      const types = api_call.types
      if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Invalid API types')
      }
      const [ requestType, successType, failureType ] = types

      const validator = api_call.validator

      // fire off prefetch if passed
      if (action.prefetch) {
        if (typeof action.prefetch === 'object') {
          next(action.prefetch)
        } else if (typeof action.prefetch === 'function') {
          action.prefetch(store.dispatch, store.getState)
        }
      }

      next(getRequestAction(requestType, action))

      const client = getClient(endpoint)
        .call(method)
        .setVersion(version)
        .params(params)

      if (process && process.env && process.env.NODE_ENV) {
        client.setEnvironment(process.env.NODE_ENV);
      }

      const auth = api_call.auth
      if (auth === true) {
        client.auth()
      }

      if (typeof auth === 'object') {
        if (typeof auth.username !== 'undefined') {
          const { username, password } = auth
          client.auth(username, password)
        } else if (typeof auth.tp_token !== 'undefined') {
          const { tp_token } = auth
          client.auth(tp_token)
        }
      }

      const apiPromise = client[http_method]();
      apiPromise.then((_response) => {
        const response = Object.assign({}, _response)
        const errors = response.errors

        response.__validation = { isValid: true }

        if (typeof validator === 'function') {
          response.__validation = validator(response)
        }

        if (Array.isArray(errors) && errors.length > 0) {
          next(getFailureAction(failureType, action, errors))
        } else {
          if (Raven && !response.__validation.isValid) {
            // Somehow, we got back an invalid response from the API
            // that wasn't a typical error response
            Raven.captureMessage(`Invalid API Response: ${endpoint}/${method}. ${response.__validation.reason}`, {
              extra: {
                api_call,
                response
              }
            })
          }

          next(getSuccessAction(successType, action, response))
        }
        return response
      }, (error) => {
        if (error.status === 401) {
          next(ActionCreators.authenticationFailed())
          next(push(`/${window.__LOCALE__.locale}/login`))
        } else {
          next(getFailureAction(failureType, action, [ error ]))
        }
        return error
      })

      return apiPromise
    }
  }
}
