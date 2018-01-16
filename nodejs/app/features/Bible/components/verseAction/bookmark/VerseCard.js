import React, { Component, PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import Card from '../../../../../components/Card'
import XMark from '../../../../../components/XMark'


class VerseCard extends Component {

	render() {
		const {
			verseContent,
			verseHeading,
			deleteVerse,
			isLink,
			versionID,
			local_abbreviation,
			intl,
			localizedLink,
			children
		} = this.props

		const verses = []
		let cardFooter = null

		if (verseContent && Object.keys(verseContent).length > 0) {
			Object.keys(verseContent).forEach((key) => {
				const verse = verseContent[key]
				const heading = verseHeading || <h2 className='heading'>{ `${verse.heading}` }</h2>

				if (deleteVerse) {
					verses.push(
						<div key={key}>
							<div className='verse small-11'>
								{ heading }
								<div className='verse-content' dangerouslySetInnerHTML={{ __html: verse.content }} />
							</div>
							<div className='delete small-1'><XMark width={18} height={18} onClick={deleteVerse.bind(this, key)} /></div>
						</div>
					)
				} else if (isLink) {
					verses.push(
						<div key={key} className='verse'>
							{ heading }
							<Link
								to={localizedLink(`/bible/${versionID}/${verse.usfm}.${local_abbreviation.toLowerCase()}`)}
								title={`${intl.formatMessage({ id: 'Reader.read reference' }, { reference: `${verse.human}` })} ${local_abbreviation}`}
							>
								<div className='verse-content' dangerouslySetInnerHTML={{ __html: verse.content }} />
							</Link>
						</div>
						)
				} else {
					verses.push(
						<div key={key} className='verse'>
							{ heading }
							<div className='verse-content' dangerouslySetInnerHTML={{ __html: verse.content }} />
						</div>
						)
				}
			})
		}

		// this is for rendering an additional component(s) at the footer for
		// specific action (label selector for book mark, reference selector for note, etc)
		if (children) {
			cardFooter = (
				<div className='card-footer'>
					{ children }
				</div>
			)
		}

		return (
			<Card>
				<div className='verse-card'>
					{ verses }
					{ cardFooter }
				</div>
			</Card>
		)
	}
}


/**
 * card to display verses with headers and optional children (add labels, etc.)
 *
 * @verseContent 			{object} 			object of verse reference objects to display on card
 * @deleteVerse				{function}		display X and call function on click
 * @verseHeading			{node}				optional element for verse card heading
 * 																	if not passed, then the verseContent.heading will be rendered
 * 																	inside an h2
 */
VerseCard.propTypes = {
	verseContent: PropTypes.shape({
		content: PropTypes.string,
		heading: PropTypes.string,
		human: PropTypes.string,
		usfm: PropTypes.array,
	}),
	versionID: PropTypes.number,
	local_abbreviation: PropTypes.string,
	deleteVerse: React.PropTypes.func,
	verseHeading: React.PropTypes.node,
	isLink: React.PropTypes.bool,
	children: PropTypes.any,
}

VerseCard.defaultProps = {
	verseContent: null,
	isLink: false,
	verseHeading: null,
	deleteVerse: null,
	children: null,
	versionID: null,
	local_abbreviation: null
}

export default injectIntl(VerseCard)
