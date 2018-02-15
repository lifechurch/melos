import React, { Component } from 'react'
import PropTypes from 'prop-types'

const DEBOUNCE_TIMEOUT = 300

class Textarea extends Component {
	constructor(props) {
		super(props)
		this.state = { stateValue: props.value, changeEvent: {} }
	}

	componentDidMount() {
		this.resize()
	}

	componentWillReceiveProps(nextProps) {
		const { value } = this.props
		if (value !== nextProps.value && nextProps.value !== this.state.value) {
			this.setState({ stateValue: nextProps.value })
		}
	}

	sendChange = () => {
		const { value, onChange } = this.props
		const el = this.textarea

		if (typeof el === 'object' && (el.value !== value)) {
			onChange({ target: el, currentTarget: el })
		}
	}

	handleChange = (changeEvent) => {
		this.resize()
		this.setState({ stateValue: changeEvent.target.value })

		if (typeof this.cancelChange === 'number') {
			clearTimeout(this.cancelChange)
			this.cancelChange = null
		}

		this.cancelChange = setTimeout(this.sendChange, DEBOUNCE_TIMEOUT)
	}

	resize = () => {
		const el = this.textarea

		if (el.value !== '') {
			el.style.overflowY = 'hidden';
			el.style.height = 'auto';
			el.style.height = `${el.scrollHeight}px`
		} else {
			el.style.height = '2.5em'
		}
	}

	render() {
		const { size, placeholder, name } = this.props
		const { stateValue } = this.state
		return (
			<textarea
				{...this.props}
				ref={(val) => { this.textarea = val }}
				name={name}
				size={size}
				placeholder={placeholder}
				onChange={this.handleChange}
				value={stateValue}
			/>
		)
	}
}

Textarea.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	placeholder: PropTypes.string,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
}

Textarea.defaultProps = {
	size: 'medium',
	placeholder: null,
	value: null
}

export default Textarea
