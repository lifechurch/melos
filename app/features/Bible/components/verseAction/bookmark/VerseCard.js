import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../../actions/creators'
import Card from '../../../../../components/Card'
import XMark from '../../../../../components/XMark'
import { injectIntl, FormattedMessage } from 'react-intl'
import Immutable from 'immutable'

class VerseCard extends Component {

	render() {
		const { verseContent, verseHeading, deleteVerse, intl } = this.props

		let verses = []
		let cardFooter = null

		if (verseContent && Object.keys(verseContent).length > 0) {
			Object.keys(verseContent).forEach((key) => {
				let verse = verseContent[key]
				let heading = verseHeading ? verseHeading : <h2 className='heading'>{ `${ verse.heading }` }</h2>

				if (deleteVerse) {
					verses.push (
						<div key={key}>
							<div className='verse small-11'>
								{ heading }
								<div className='verse-content' dangerouslySetInnerHTML={{ __html: verse.content }}/>
							</div>
							<div className='delete small-1'><XMark width={18} height={18} onClick={deleteVerse.bind(this, key)}/></div>
						</div>
					)
				} else {
					verses.push (
						<a
							key={key}
							className='verse'
							href={`/bible/${verse.versionInfo.id}/${verse.usfm}`}
							title={`${intl.formatMessage({ id: "read reference" }, { reference: `${verse.human}` })} ${verse.versionInfo.local_abbreviation}`}
						>
							{ heading }
							<div className='verse-content' dangerouslySetInnerHTML={{ __html: verse.content }}/>
						</a>
					)
				}
			})
		}

		// this is for rendering an additional component(s) at the footer for
		// specific action (label selector for book mark, reference selector for note, etc)
		if (this.props.children) {
			cardFooter = (
				<div className='card-footer'>
					{ this.props.children }
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
	verseContent: React.PropTypes.shape({
		content: React.PropTypes.string,
		heading: React.PropTypes.string,
		human: React.PropTypes.string,
		usfm: React.PropTypes.array,
		versionInfo: React.PropTypes.shape({
			id: React.PropTypes.number,
			local_abbreviation: React.PropTypes.string,
		}),
	}),
	deleteVerse: React.PropTypes.func,
	verseHeading: React.PropTypes.node,
}

export default injectIntl(VerseCard)