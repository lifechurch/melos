import React, { Component, PropTypes } from 'react'
import PlusButton from '../../../../../components/PlusButton'
import RevManifest from '../../../../../../app/lib/revManifest'

class LabelInput extends Component {

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

	render() {
		const { input, disabled } = this.props

		return (
			<div className='label-input'>
				<div className='label-icon-container'>
					<img className='label-icon' src={`/images/${RevManifest('label.png')}`} />
				</div>
				<input value={input} disabled={disabled} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} onBlur={this.handleBlur.bind(this)} />
				<div className='plus-button-container' onClick={this.handleClick.bind(this)} >
					<PlusButton />
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