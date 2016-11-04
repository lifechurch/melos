import React, { Component, PropTypes } from 'react'
import PlusButton from '../../../../../components/PlusButton'
import RevManifest from '../../../../../../app/lib/revManifest'
import LabelList from './LabelList'

class LabelInput extends Component {

	constructor(props) {
		super(props)

		this.handleChange = ::this.handleChange
		this.handleClick = ::this.handleClick
		this.handleBlur = ::this.handleBlur
		this.handleKeyDown = ::this.handleKeyDown
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

	render() {
		const { input, disabled, addedLabels, onDelete } = this.props

		let labels = []
		if (Object.keys(addedLabels).length > 0) {
			Object.keys(addedLabels).forEach((key) => {
				// if the label hasn't been deleted, render it next to the input
				if (addedLabels[key]) {
					labels.push({ label: key })
				}
			})
		}

		return (
			<div className='label-input'>
				<div className='label-icon-container'>
					<img className='label-icon' src={`/images/${RevManifest('label.png')}`} />
				</div>
				<div className='added-labels'>
					<LabelList list={labels} canDelete={true} onDelete={onDelete} />
				</div>
				<input value={input} disabled={disabled} onChange={this.handleChange} onKeyDown={this.handleKeyDown} onBlur={this.handleBlur} />
				<div className='plus-button-container' onClick={this.handleClick} >
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