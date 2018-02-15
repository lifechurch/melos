import React, { Component } from 'react'
import PropTypes from 'prop-types'

const DEBOUNCE_TIMEOUT = 100

class Input extends Component {
	constructor(props) {
		super(props)
		this.state = {
			stateValue: props.value,
			changeEvent: {}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setState({ stateValue: nextProps.value })
		}
	}

	clearInput = () => {
		this.setState({ stateValue: '' }, this.sendChange)
	}

	sendChange = () => {
		const { onChange, value } = this.props
		const el = this.refs.inputElement

		if (typeof onChange === 'function' && typeof el === 'object' && (el.value !== value)) {
			onChange({ target: el, currentTarget: el })
		}
	}

	handleChange = (changeEvent) => {
		this.setState({ stateValue: changeEvent.target.value })

		if (typeof this.cancelChange === 'number') {
			clearTimeout(this.cancelChange)
			this.cancelChange = null
		}

		this.cancelChange = setTimeout(this.sendChange, DEBOUNCE_TIMEOUT)
	}

	handleKeyUp = (e) => {
		const { onKeyUp } = this.props
		if (onKeyUp && typeof onKeyUp === 'function') {
			onKeyUp(e)
		}
	}

	render() {
		const { customClass, size, name, placeholder, onKeyPress, type } = this.props
		const { stateValue } = this.state

		return (
			<input
				ref="inputElement"
				onKeyPress={onKeyPress}
				className={customClass || size}
				onChange={this.handleChange}
				onKeyUp={this.handleKeyUp}
				value={stateValue}
				name={name}
				placeholder={placeholder}
				type={type}
			/>
		)
	}
}

Input.propTypes = {
	onChange: PropTypes.func.isRequired,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	placeholder: PropTypes.string,
	name: PropTypes.string,
	onKeyUp: PropTypes.func,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
	type: PropTypes.oneOf(['text', 'password', 'search']),
	customClass: PropTypes.string,
	debounce: PropTypes.bool,
}

Input.defaultProps = {
	size: 'medium',
	placeholder: '',
	value: '',
	name: 'input',
	customClass: null,
	type: 'text',
	onKeyUp: null,
	debounce: true,
}

export default Input
