import React, { Component, PropTypes } from 'react'

const genericError = 'An error occurred'

function getError(e) {
	if (typeof e === 'object') {
		const key = e.key
		return typeof key === 'string' ? getErrorFromKey(key) : genericError
	} else if (typeof e === 'string') {
		return e
	} else {
		return genericError
	}
}

function getErrorFromKey(key) {
	const errors = {
		'events.latitude.required': 'You must choose a location from the map.',
		'events.google_place_id.required': 'You must choose a location from the map.',
		'events.timezone.required': 'Timezone is required.',
		'events.times.0.start_dt.must_be_a_future_date': 'Start Time cannot be in the past.'
	}
	const message = errors[key]
	return typeof message === 'string' ? message : [genericError, key].join(': ')
}

class ErrorMessage extends Component {
	render() {
		const { hasError, errors } = this.props

		var errorList
		var errorListItems
		var className
		if (hasError) {
			className = 'error-message alert-box alert radius'
			if (Array.isArray(errors) && errors.length > 0) {
				errorListItems = errors.map((e) => {
					return (<li>{getError(e)}</li>)
				})
			} else if (typeof errors == 'object' && Object.keys(errors).length > 0) {
				errorListItems = []
				for (var k in errors) {
					errorListItems.push.apply(errorListItems, errors[k].map((e) => { return (<li>{getError(e)}</li>) }))
				}
			} else {
				errorListItems = (<li>An error occurred.</li>)
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

