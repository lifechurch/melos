import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PlusButton from '../../../../../components/PlusButton'
import LabelIcon from '../../../../../components/LabelIcon'
import LabelList from './LabelList'

class LabelInput extends Component {

	constructor(props) {
		super(props)

		this.state = {
			inputActive: false
		}
	}

	handleChange = (changeEvent) => {
		const { onChange } = this.props
		if (typeof onChange === 'function') {
			onChange(changeEvent.target.value)
		}
	}

	handleKeyDown = (keyEvent) => {
		const { onKeyDown } = this.props
		if (typeof onKeyDown === 'function') {
			onKeyDown(keyEvent, keyEvent.key, keyEvent.keyCode)
		}
	}

	handleClick = () => {
		const { onClick } = this.props
		if (typeof onClick === 'function') {
			onClick()
		}
	}

	handleBlur = () => {
		const { onBlur } = this.props
		if (typeof onBlur === 'function') {
			onBlur()
		}
	}

	// the input looks different before the user interacts with it
	activateInput = () => {
		const { inputActive } = this.state

		if (!inputActive) {
			this.setState({ inputActive: true })
		}
	}

	render() {
		const { input, disabled, intl } = this.props
		const { inputActive } = this.state

		// don't show the dropdown button when the modal is open
		let plusbutton = null
		if (!disabled && inputActive) plusbutton = <PlusButton />

		return (
			<div className={`label-input ${inputActive ? 'inputactive' : ''} `}>
				<div className='label-icon-container' onClick={this.activateInput} >
					<LabelIcon />
				</div>
				<input
					value={input}
					disabled={disabled}
					placeholder={!inputActive ? intl.formatMessage({ id: 'Reader.verse action.add labels' }) : null}
					onChange={this.handleChange}
					onKeyDown={this.handleKeyDown}
					onBlur={this.handleBlur}
					onFocus={this.activateInput}
				/>
				<div className='plus-button-container' onClick={this.handleClick} >
					{ plusbutton }
				</div>
			</div>
		)
	}
}


/**
 * 		@input					  		string input value for the input field
 * 		@disabled							input is disabled
 * 		@onKeyDown	   				function to call when pressing a key on the input
 * 														used for doing stuff like arrow key auto-completes etc.
 * 		@onClick			  			function to call when clicking plus button
 * 		@onChange							function to call when input field value changes
 * 		@onBlur								function to call when clicking out of the input field
 */
LabelInput.propTypes = {
	input: PropTypes.string,
	disabled: PropTypes.bool,
	onKeyDown: PropTypes.func,
	onClick: PropTypes.func,
	onChange: PropTypes.func,
	onBlur: PropTypes.func
}

export default LabelInput