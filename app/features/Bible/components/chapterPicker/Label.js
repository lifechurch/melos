import React, { Component, PropTypes } from 'react'
import DropDownArrow from '../../../'

class Label extends Component {

	constructor(props) {
		super(props)
		const { input } = props
		this.state = { value: input || '' }
	}

	chapterSelect(chapter) {
		this.setState( { selectedChapter: chapter.usfm } )
		const { onSelect } = this.props
		if (typeof onSelect == 'function') {
			onSelect(chapter)
		}
	}

	render() {
		const { onClick } = this.props
		const { value } = this.state



		return (
			<div className='chapter-label'>
				<input value={this.state.value} onChange={onClick.bind(this)} />

			</div>
		)
	}
}


/**
 * 		@input					  		string input
 * 		@onEnter	   					function to call when pressing enter on input
 * 		@onClick			  			function to call when clicking dropdown
 * 		@onChange							function to call when input value changes
 */
Label.propTypes = {
	input: React.PropTypes.string,
	onEnter: React.PropTypes.func,
	onClick: React.PropTypes.func,
	onChange: React.PropTypes.func
}

export default Label