import React, { Component, PropTypes } from 'react'

const DEBOUNCE_TIMEOUT = 300

class Textarea extends Component {
	constructor(props) {
		super(props)
		this.state = { stateValue: props.value, changeEvent: {} }
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setState({stateValue: nextProps.value})
		}
	}

	componentDidMount() {
		::this.resize(true)
	}

	sendChange() {
		const { value, onChange } = this.props
		const el = this.refs.textareaElement;

		if (typeof el === 'object' && (el.value !== value)) {
			onChange({target: el, currentTarget: el})
		}
	}

	handleChange(changeEvent) {
		::this.resize()
		this.setState({stateValue: changeEvent.target.value})

		if (typeof this.cancelChange === 'number') {
			clearTimeout(this.cancelChange)
			this.cancelChange = null
		}

		this.cancelChange = setTimeout(::this.sendChange, DEBOUNCE_TIMEOUT)
	}

	resize(onLoad = false) {
		const el = this.refs.textareaElement;

		if (el.value != ''){
		    el.style.overflowY = 'hidden';
		    el.style.height = 'auto';
			el.style.height = el.scrollHeight + "px"
		} else {
			el.style.height = "2.5em"
		}
	}

	render() {
		const { size } = this.props
		const { stateValue } = this.state

		return (
			<textarea ref="textareaElement" {...this.props} onChange={::this.handleChange} value={stateValue}></textarea>
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

export default Textarea
