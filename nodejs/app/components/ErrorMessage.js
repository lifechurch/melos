import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'

function getError(e, scope = 'default', formatMessage, genericError) {
	if (typeof e === 'object') {
		const key = e.key
		return typeof key === 'string' ? getErrorFromKey(key, scope, formatMessage, genericError) : genericError
	} else if (typeof e === 'string') {
		return e
	} else {
		return genericError
	}
}

function getErrorFromKey(key, scope, formatMessage, genericError) {
	const errors = {
		default: {
			'events.latitude.required': formatMessage({ id: 'components.ErrorMessage.deafult.events.latitude.required' }),
			'events.google_place_id.required': formatMessage({ id: 'components.ErrorMessage.default.events.google_place_id.required' }),
			'events.timezone.required': formatMessage({ id: 'components.ErrorMessage.default.events.timezone.required' }),
			'events.times.0.start_dt.must_be_a_future_date': formatMessage({ id: 'components.ErrorMessage.default.events.times.start_dt.must_be_a_future_date' }),
			'bible.reference.not_found': formatMessage({ id: 'components.ErrorMessage.default.bible.reference.not_found' })
		},
		reference: {
			'events.usfm.invalid': formatMessage({ id: 'components.ErrorMessage.reference.events.usfm.invalid' })
		},
		announcement: {
			'events.title.required': formatMessage({ id: 'components.ErrorMessage.announcement.events.title.required' })
		},
		url: {
			'events.url.required': formatMessage({ id: 'components.ErrorMessage.url.events.url.required' }),
			'events.title.required': formatMessage({ id: 'components.ErrorMessage.url.events.title.required' })
		}
	}
	let message
	if (errors[scope] && errors[scope][key]) {
		message = errors[scope][key]
	}
	return typeof message === 'string' ? message : [genericError, key].join(': ')
}

class ErrorMessage extends Component {
	render() {
		const { hasError, errors, scope, intl } = this.props
		const genericError = intl.formatMessage({ id: 'components.ErrorMessage.genericError' })

		let errorList
		let errorListItems
		let className

		if (hasError) {
			className = 'error-message alert-box alert radius'
			if (Array.isArray(errors) && errors.length > 0) {
				errorListItems = errors.map((e, i) => {
					return (<li key={i}>{getError(e, scope, intl.formatMessage, genericError)}</li>)
				})
			} else if (typeof errors === 'object' && Object.keys(errors).length > 0) {
				errorListItems = []
				for (const k in errors) {
					errorListItems.push(...errors[k].map((e, i) => { return (<li key={i}>{getError(e, scope, intl.formatMessage, genericError)}</li>) }))
				}
			} else {
				errorListItems = (<li>{genericError}</li>)
			}

			errorList = (<ul>{errorListItems}</ul>)

			return (
				<div className={className}>
					{errorList}
				</div>
			)
		} else {
			return null
		}

	}
}

ErrorMessage.propTypes = {
	hasError: PropTypes.bool.isRequired,
	errors: PropTypes.array
}

export default injectIntl(ErrorMessage)

