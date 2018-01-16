import React, { PropTypes } from 'react'
import { Link } from 'react-router'

function Chapters(props) {

	const {
			list,
			focus,
			versionID,
			listSelectionIndex,
			versionAbbr,
			onMouseOver,
			selectedChapter,
			localizedLink,
			linkBuilder,
			onRefSelect,
		} = props

	const chapters = []

	if (list) {
		Object.keys(list).forEach((usfm, index) => {
			const chapter = list[usfm]

			const active = (usfm === selectedChapter) ? 'active' : ''
			if (focus) {
				const focusClass = (index === listSelectionIndex) ? 'focus' : ''
				chapters.push(
					onRefSelect ?
						<a tabIndex={0} onClick={onRefSelect.bind(this, usfm)}>
							<li className={`${active} ${focusClass}`} onMouseOver={onMouseOver.bind(this, 'chapters', index)} >
								<div>{ chapter.human }</div>
							</li>
						</a> :
						<Link key={usfm} to={localizedLink(linkBuilder(versionID, usfm, versionAbbr))} >
							<li className={`${active} ${focusClass}`} onMouseOver={onMouseOver.bind(this, 'chapters', index)} >
								<div>{ chapter.human }</div>
							</li>
						</Link>
				)
			} else {
				chapters.push(
					onRefSelect ?
						<a tabIndex={0} onClick={onRefSelect.bind(this, usfm)}>
							<li className={`${active}`}>
								<div>{ chapter.human }</div>
							</li>
						</a> :
						<Link key={usfm} to={localizedLink(linkBuilder(versionID, usfm, versionAbbr))} >
							<li className={`${active}`}>
								<div>{ chapter.human }</div>
							</li>
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


/**
 * @param list {object} object of chapter objects for the current version
 * @param versionID {number}
 * @param listSelectionIndex {number} index for selecting list element with arrow keys
 * @param focus {boo} allow mouse over and key actions on list items
 * @param versionAbbr {string}
 * @param onMouseOver {function}
 * @param selectedChapter {string}
 * @param localizedLink {function}
 * @param linkBuilder {function}
 */
Chapters.propTypes = {
	list: PropTypes.object.isRequired,
	versionID: PropTypes.number,
	listSelectionIndex: PropTypes.number,
	focus: PropTypes.bool,
	versionAbbr: PropTypes.string,
	onMouseOver: PropTypes.func,
	selectedChapter: PropTypes.string,
	localizedLink: PropTypes.func.isRequired,
	linkBuilder: PropTypes.func.isRequired,
	onRefSelect: PropTypes.func,
}

Chapters.defaultProps = {
	versionID: null,
	listSelectionIndex: 0,
	focus: false,
	versionAbbr: null,
	onMouseOver: null,
	selectedChapter: null,
	onRefSelect: null,
}

export default Chapters
