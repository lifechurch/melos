import React, { Component, PropTypes } from 'react'
import PlusButton from '../../../../../components/PlusButton'
import RevManifest from '../../../../../../app/lib/revManifest'
import LabelList from './LabelList'

class LabelInput extends Component {

	constructor(props) {
		super(props)

		this.state = {
			inputActive: false
		}

		this.handleChange = ::this.handleChange
		this.handleClick = ::this.handleClick
		this.handleBlur = ::this.handleBlur
		this.handleKeyDown = ::this.handleKeyDown
		this.activateInput = ::this.activateInput
	}

	handleChange(changeEvent) {
		const { onChange } = this.props
		if (typeof onChange == 'function') {
			onChange(changeEvent.target.value)
		}
	}

	handleKeyDown(keyEvent) {
		const { onKeyDown } = this.props
		if (typeof onKeyDown == 'function') {
			onKeyDown(keyEvent, keyEvent.key, keyEvent.keyCode)
		}
	}

	handleClick() {
		const { onClick } = this.props
		if (typeof onClick == 'function') {
			onClick()
		}
	}

	handleBlur() {
		const { onBlur } = this.props
		if (typeof onBlur == 'function') {
			onBlur()
		}
	}

	// the input looks different before the user interacts with it
	activateInput() {
		const { inputActive } = this.state

		if (!inputActive) {
			this.setState({ inputActive: true })
		}
	}

	render() {
		const { input, disabled, addedLabels, intl } = this.props
		const { inputActive } = this.state

		// don't show the dropdown button when the modal is open
		let plusbutton = null
		if (!disabled && inputActive) plusbutton = <PlusButton />

		return (
			<div className={`label-input ${inputActive ? 'inputactive' : ''} `}>
				<div className='label-icon-container' onClick={this.activateInput} >
					<img className='label-icon' src={`/images/${RevManifest('label.png')}`} />
				</div>
				<input
					value={input}
					disabled={disabled}
					placeholder={!inputActive ? intl.formatMessage({ id: 'Reader.labels.add labels' }) : null}
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
	input: React.PropTypes.string,
	disabled: React.PropTypes.bool,
	onKeyDown: React.PropTypes.func,
	onClick: React.PropTypes.func,
	onChange: React.PropTypes.func,
	onBlur: React.PropTypes.func
}

export default LabelInput