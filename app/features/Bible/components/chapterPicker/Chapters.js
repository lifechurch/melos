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
		const { list, onSelect } = this.props
		const { selectedChapter } = this.state

		var chapters = []

		if (list) {
			Object.keys(list).forEach((usfm) =>  {
				var chapter = list[usfm]
				chapters.push( (<li key={usfm} onClick={this.chapterSelect.bind(this, chapter)} className={ (usfm == selectedChapter) ? 'active' : ''}>{ chapter.human }</li>) )
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
 */
Chapters.propTypes = {
	list: React.PropTypes.object.isRequired,
	onSelect: React.PropTypes.func,
	initialSelection: React.PropTypes.string
}

export default Chapters