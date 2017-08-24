import type from './constants'
import cookie from 'react-cookie'
import moment from 'moment'

const ActionCreators = {

	changeLanguage(params) {
		return dispatch => {
			return new Promise((resolve) => {
				dispatch({ type: type('changeLanguageRequest'), params })

				const { language_tag, user_id, locale } = params
				let { redirect } = params

				if (typeof redirect === 'undefined') {
					redirect = true
				}

				function finish(response) {
					cookie.save('locale', locale, { maxAge: moment().add(1, 'y').toDate(), path: '/' })
					if (redirect) {
						window.location = `/${locale}/`
					}
					dispatch({ type: type('changeLanguageSuccess'), params, response })
					if (redirect === false) {
						resolve()
					}
				}

				if (typeof language_tag === 'undefined' || typeof locale === 'undefined') {
					return dispatch({ type: type('changeLanguageFailure'), params, error: 'Invalid params' })

				} else if (typeof user_id === 'undefined') {
					finish({})

				} else {
					dispatch(ActionCreators.getUser({ id: user_id })).then((user) => {
						user.language_tag = locale.replace('-', '_')
						dispatch(ActionCreators.updateUser(user)).then((response) => {
							finish(response)
						}, (error) => {
							return dispatch({ type: type('changeLanguageFailure'), params, error })
						})
					}, (error) => {
						return dispatch({ type: type('changeLanguageFailure'), params, error })
					})
				}
			})
		}
	},

	getUser(params) {
		return {
			params,
			api_call: {
				endpoint: 'users',
				method: 'view',
				version: '3.1',
				auth: true,
				params,
				http_method: 'get',
				types: [ type('getUserRequest'), type('getUserSuccess'), type('getUserFailure') ]
			}
		}
	},

	updateUser(params) {
		return {
			params,
			api_call: {
				endpoint: 'users',
				method: 'update',
				version: '3.1',
				auth: true,
				params,
				http_method: 'post',
				types: [ type('updateUserRequest'), type('updateUserSuccess'), type('updateUserFailure') ]
			}
		}
	}

}

export default ActionCreators
