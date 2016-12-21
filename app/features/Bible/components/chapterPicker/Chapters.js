import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class Chapters extends Component {

	render() {
		const {
			list,
			focus,
			versionID,
			listSelectionIndex,
			onMouseOver,
			selectedChapter,
			localizedLink,
			params
		} = this.props

		let chapters = []

		if (list) {
			Object.keys(list).forEach((usfm, index) =>  {
				let chapter = list[usfm]

				let active = (usfm == selectedChapter) ? 'active' : ''
				if (focus) {
					let focusClass = (index == listSelectionIndex) ? 'focus' : ''
					chapters.push(
						<Link key={usfm} to={localizedLink(`/bible/${versionID}/${usfm}.${params.vabbr}`)} >
							<li className={`${active} ${focusClass}`} onMouseOver={onMouseOver.bind(this, "chapters", index)} >{ chapter.human }</li>
						</Link>
					)
				} else {
					chapters.push(
						<Link key={usfm} to={localizedLink(`/bible/${versionID}/${usfm}.${params.vabbr}`)} >
							<li className={`${active}`}>{ chapter.human }</li>
						</Link>
					)
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
 * 		@initialSelection	   	usfm for highlighting currently selected chapter
 * 		@listSelectionIndex 	index for selecting list element with arrow keys
 * 		@focus								allow mouse over and key actions on list items
 */
Chapters.propTypes = {
	list: React.PropTypes.object.isRequired,
	initialSelection: React.PropTypes.string,
	versionID: React.PropTypes.number,
	listSelectionIndex: React.PropTypes.number,
	focus: React.PropTypes.bool
}

export default Chapters