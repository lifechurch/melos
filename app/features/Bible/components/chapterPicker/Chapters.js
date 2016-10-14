import React, { Component, PropTypes } from 'react'

class Chapters extends Component {

	constructor(props) {
		super(props)
		const { initialSelection } = props
		this.state = { selectedChapter: initialSelection || null }
	}

	chapterSelect(chapter) {
		this.setState( { selectedChapter: chapter.usfm } )
		const { onSelect } = this.props
		if (typeof onSelect == 'function') {
			onSelect(chapter)
		}
	}

	render() {
		const { list, onSelect, focus, listSelectionIndex, onMouseOver } = this.props
		const { selectedChapter } = this.state

		var chapters = []

		if (list) {
			Object.keys(list).forEach((usfm, index) =>  {
				let chapter = list[usfm]

				let active = (usfm == selectedChapter) ? 'active' : ''
				if (focus) {
					let focusClass = (index == listSelectionIndex) ? 'focus' : ''
					chapters.push( (<li key={usfm} onClick={this.chapterSelect.bind(this, chapter)} className={`${active} ${focusClass}`} onMouseOver={onMouseOver.bind(this, "chapters", index)} >{ chapter.human }</li>) )
				} else {
					chapters.push( (<li key={usfm} onClick={this.chapterSelect.bind(this, chapter)} className={`${active}`}>{ chapter.human }</li>) )
				}
			})
		}

		return (
			<ul className='chapter-list'>
				{ chapters }
			</ul>
		)
	}
}


/**
 * 		@list					  			object of chapter objects for the current version
 * 		@onSelect			  			function to call when selecting chapter
 * 		@initialSelection	   	usfm for highlighting currently selected chapter
 * 		@listSelectionIndex 	index for selecting list element with arrow keys
 * 		@focus								allow mouse over and key actions on list items
 */
Chapters.propTypes = {
	list: React.PropTypes.object.isRequired,
	onSelect: React.PropTypes.func,
	initialSelection: React.PropTypes.string,
	listSelectionIndex: React.PropTypes.number,
	focus: React.PropTypes.bool
}

export default Chapters