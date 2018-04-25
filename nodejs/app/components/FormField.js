import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from './Input'
import Textarea from './Textarea'
import Select from './Select'
import HtmlEditor from './HtmlEditor'
import { injectIntl } from 'react-intl'

class FormField extends Component {
	render() {
		const { InputType, errors, intl } = this.props

		let labelClass = ''
		let fieldError = null
		if (Array.isArray(errors) && errors.length > 0) {
			labelClass = 'error'
			let label = ''
			for (const e of errors) {
				if (typeof e === 'string') {
					label += e
				} else if (typeof e === 'object') {
					if (typeof e.string === 'string' && typeof e.field === 'string') {
						label += intl.formatMessage({ id: e.string }, { field: intl.formatMessage({ id: e.field }) })
					}
				}
			}
			fieldError = (<small className={labelClass}>{label}</small>)
		}

		return (
			<div>
				<label className={labelClass}>
					<InputType {...this.props} />
				</label>
				{fieldError}
			</div>
		)
	}
}

FormField.propTypes = {
	InputType: PropTypes.any.isRequired,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	placeholder: PropTypes.string,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
	errors: PropTypes.array
}

export default injectIntl(FormField)