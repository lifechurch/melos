import React, { Component, PropTypes } from 'react'

const DEBOUNCE_TIMEOUT = 300

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

	sendChange = () => {
		const { onChange } = this.props
		const { stateValue } = this.state

		if (onChange) {
			onChange(stateValue)
		}
	}

	handleChange = (changeEvent) => {
		const { debounce } = this.props

		this.setState({ stateValue: changeEvent.target.value });
		if (debounce) {
			if (typeof this.cancelChange === 'number') {
				clearTimeout(this.cancelChange)
				this.cancelChange = null
			}
			this.cancelChange = setTimeout(this.sendChange, DEBOUNCE_TIMEOUT)
		} else {
			this.sendChange()
		}
	}

	handleKeyUp = (e) => {
		const { onKeyUp } = this.props
		if (onKeyUp && typeof onKeyUp === 'function') {
			onKeyUp(e)
		}
	}

	render() {
		const { customClass, size, name, placeholder, type } = this.props
		const { stateValue } = this.state

		return (
			<input
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
