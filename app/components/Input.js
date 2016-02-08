import React, { Component, PropTypes } from 'react'

const DEBOUNCE_TIMEOUT = 300

class Input extends Component {
	constructor(props) {
		super(props)
		this.state = { stateValue: props.value, changeEvent: {} }
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setState({stateValue: nextProps.value})
		}
	}

	sendChange() {
		const { value, onChange } = this.props
		const el = this.refs.inputElement;

		if (typeof el === 'object' && (el.value !== value)) {
			onChange({target: el, currentTarget: el})
		}
	}

	handleChange(changeEvent) {
		this.setState({stateValue: changeEvent.target.value});

		if (typeof this.cancelChange === 'number') {
			clearTimeout(this.cancelChange)
			this.cancelChange = null
		}

		this.cancelChange = setTimeout(::this.sendChange, DEBOUNCE_TIMEOUT)
	}

	render() {
		const { size } = this.props
		const { stateValue } = this.state

		return (
			<input type='text' ref='inputElement' className={size} {...this.props} onChange={::this.handleChange} value={stateValue} />
		)
	}
}

Input.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	placeholder: PropTypes.string,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
}

export default Input
