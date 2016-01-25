import React, { Component, PropTypes } from 'react'
import Input from './Input'
import Textarea from './Textarea'
import Select from './Select'

class FormField extends Component {
	render() {
		const { InputType, errors } = this.props

		var labelClass = ''
		var fieldError = null
		if (Array.isArray(errors) && errors.length > 0) {
			labelClass = 'error'
			fieldError = (<small className={labelClass}>{errors.join(' ')}</small>)
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
	InputType: PropTypes.oneOfType([
		PropTypes.instanceOf(Input),
		PropTypes.instanceOf(Textarea),
		PropTypes.instanceOf(Select)
	]),
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	placeholder: PropTypes.string,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
	errors: PropTypes.array
}

export default FormField