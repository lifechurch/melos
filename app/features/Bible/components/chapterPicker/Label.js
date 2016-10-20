import React, { Component, PropTypes } from 'react'
import DropDownArrow from '../../../../components/DropDownArrow'

class Label extends Component {

	constructor(props) {
		super(props)
		const { input } = props
		this.state = { dropdown: false }
	}

	handleChange(changeEvent) {
		const { onChange } = this.props
		// this.setState( { value: changeEvent.target.value } )
		if (typeof onChange == 'function') {
			onChange(changeEvent.target.value)
		}
	}

	handleKeyDown(keyEvent) {
		const { onKeyDown } = this.props
		console.log(keyEvent.key)
		if (typeof onKeyDown == 'function') {
			onKeyDown(keyEvent, keyEvent.key, keyEvent.keyCode)
		}
	}

	handleClick() {
		const { onClick } = this.props
		this.setState( { dropdown: !this.state.dropdown } )
		if (typeof onClick == 'function') {
			onClick(this.state.dropdown)
		}
	}

	handleBlur() {
		const { onBlur } = this.props
		if (typeof onBlur == 'function') {
			onBlur()
		}
	}

	render() {
		const { input, disabled } = this.props
		const { dropdown } = this.state

		let classes, dir = null
		if (dropdown) {
			classes = `open dropdown-arrow-container`
			dir = "up"
		} else {
			classes = `dropdown-arrow-container`
			dir = "down"
		}
		return (
			<div className='picker-label'>
				<input value={input} disabled={disabled} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} onBlur={this.handleBlur.bind(this)} />
				<div className={classes} onClick={this.handleClick.bind(this)} >
					<DropDownArrow dir={dir} height={6} width={12} />
				</div>
			</div>
		)
	}
}


/**
 * 		@input					  		string input value for the input field
 * 		@disabled							input is disabled
 * 		@onKeyDown	   					function to call when pressing a key on the input
 * 														used for doing stuff like arrow key auto-completes etc.
 * 		@onClick			  			function to call when clicking dropdown arrow
 * 		@onChange							function to call when input field value changes
 * 		@onBlur								function to call when clicking out of the input field
 */
Label.propTypes = {
	input: React.PropTypes.string,
	disabled: React.PropTypes.bool,
	onKeyDown: React.PropTypes.func,
	onClick: React.PropTypes.func,
	onChange: React.PropTypes.func,
	onBlur: React.PropTypes.func
}

export default Label