import React, { Component, PropTypes } from 'react'

const genericError = 'An error occurred'

function getError(e, scope='default') {
	if (typeof e === 'object') {
		const key = e.key
		return typeof key === 'string' ? getErrorFromKey(key, scope) : genericError
	} else if (typeof e === 'string') {
		return e
	} else {
		return genericError
	}
}

function getErrorFromKey(key, scope) {
	const errors = {
		'default': {
			'events.latitude.required': 'You must choose a location from the map.',
			'events.google_place_id.required': 'You must choose a location from the map.',
			'events.timezone.required': 'Timezone is required.',
			'events.times.0.start_dt.must_be_a_future_date': 'Start Time cannot be in the past.',
			'bible.reference.not_found': 'Bible reference not valid.'
		},
		'reference': {
			'events.usfm.invalid': 'Bible reference not valid.'
		},
		'announcement': {
			'events.title.required': 'Announcement title is required.'
		},
		'url': {
			'events.url.required': 'URL is required.',
			'events.title.required': 'URL Label is required.'
		}
	}
	var message
	if (errors[scope] && errors[scope][key]) {
		message = errors[scope][key]
	}
	return typeof message === 'string' ? message : [genericError, key].join(': ')
}

class ErrorMessage extends Component {
	render() {
		const { hasError, errors, scope } = this.props

		var errorList
		var errorListItems
		var className
		if (hasError) {
			className = 'error-message alert-box alert radius'
			if (Array.isArray(errors) && errors.length > 0) {
				errorListItems = errors.map((e, i) => {
					return (<li key={i}>{getError(e, scope)}</li>)
				})
			} else if (typeof errors == 'object' && Object.keys(errors).length > 0) {
				errorListItems = []
				for (var k in errors) {
					errorListItems.push.apply(errorListItems, errors[k].map((e, i) => { return (<li key={i}>{getError(e, scope)}</li>) }))
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

export default ErrorMessage

