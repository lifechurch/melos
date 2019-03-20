import GoogleMapsApi from '../api/GoogleMaps'

const methods = [ 'getTimezone', 'getPlace' ]

function getRequestAction(type, action) {
  const finalAction = Object.assign({}, action, { type })
  delete finalAction.google_maps_api_call
  return finalAction
}

function getFailureAction(type, action, errors) {
  const finalAction = Object.assign({}, action, { errors, type })
  delete finalAction.google_maps_api_call
  return finalAction
}

function getSuccessAction(type, action, response) {
  const finalAction = Object.assign({}, action, { response, type })
  delete finalAction.google_maps_api_call
  return finalAction
}

export default store => {
  return next => {
    return action => {
      const api_call = action.google_maps_api_call

      if (typeof api_call === 'undefined') {
        return next(action)
      }

      const method = api_call.method
      if (typeof method !== 'string' || methods.indexOf(method) === -1) {
        throw new Error(`Invalid Google API method: ${method}`)
      }
      const api_method = GoogleMapsApi[method]

      const { params } = api_call
      if (!Array.isArray(params)) {
        throw new Error('Invalid API params')
      }

      const types = api_call.types
      if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Invalid API types')
      }
      const [ requestType, successType, failureType ] = types

      next(getRequestAction(requestType, action))

      return api_method.apply(this, params).then((response) => {
        next(getSuccessAction(successType, action, response))
        return response
      }, (error) => {
        next(getFailureAction(failureType, action, [ error ]))
        return error
      })
    }
  }
}