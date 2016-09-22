import React, { Component, PropTypes } from 'react'

class Chapters extends Component {

	constructor(props) {
		super(props)
		this.state = { selectedChapter: props.initialSelection || null }
	}

	chapterSelect(chapter) {
		this.setState( { selectedChapter: chapter.usfm } )
		if (typeof this.props.onSelect == 'function') {
			this.props.onSelect(chapter)
		}
	}

	render() {
		const { list, onSelect } = this.props

		var chapters = []
		if (list) {
			Object.keys(list).forEach((usfm) =>  {
				var chapter = list[usfm]
				chapters.push( (<li key={usfm} onClick={this.chapterSelect.bind(this, chapter)} className={ (usfm == this.state.selectedChapter) ? 'active' : ''}><a>{ chapter.human }</a></li>) )
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