import React, { Component, PropTypes } from 'react'
import DropDownArrow from '../../../../components/DropDownArrow'

class Label extends Component {

	constructor(props) {
		super(props)
		const { input } = props
		this.state = { value: input || '', dropdown: false }
	}

	handleChange(changeEvent) {
		this.setState( { value: changeEvent.target.value } )
		const { onChange } = this.props
		if (typeof onChange == 'function') {
			onChange(changeEvent.target.value)
		}
	}

	handleKeyUp(keyEvent) {
		console.log(keyEvent.key)
		if (typeof onKeyUp == 'function') {
			onKeyUp(keyEvent.key)
		}
	}

	handleClick() {
		this.setState( { dropdown: !this.state.dropdown } )
		if (typeof onClick == 'function') {
			onClick()
		}
	}

	render() {
		const { onClick, onKeyUp, onChange } = this.props
		const { value, dropdown } = this.state

		let classes, dir = null
		if (dropdown) {
			classes = `open dropdown-arrow-container`
			dir = "up"
		} else {
			classes = `dropdown-arrow-container`
			dir = "down"
		}

		return (
			<div className='chapterpicker-label'>
				<input value={value} onChange={this.handleChange.bind(this)} onKeyUp={this.handleKeyUp.bind(this)} />
				<div className={classes} onClick={this.handleClick.bind(this)} >
					<DropDownArrow dir={dir} height={6} width={12} />
				</div>
			</div>
		)
	}
}


/**
 * 		@input					  		string input value for the input field
 * 		@onKeyUp	   					function to call when pressing a key on the input
 * 														used for doing stuff like arrow key auto-completes etc.
 * 		@onClick			  			function to call when clicking dropdown arrow
 * 		@onChange							function to call when input field value changes
 */
Label.propTypes = {
	input: React.PropTypes.string,
	onKeyUp: React.PropTypes.func,
	onClick: React.PropTypes.func,
	onChange: React.PropTypes.func
}

export default Label