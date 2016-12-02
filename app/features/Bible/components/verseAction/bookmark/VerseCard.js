import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../../actions/creators'
import Card from '../../../../../components/Card'
import XMark from '../../../../../components/XMark'
import { injectIntl, FormattedMessage } from 'react-intl'
import Immutable from 'immutable'

class VerseCard extends Component {

	// componentWillReceiveProps(nextProps) {
	// 	const { verses } = this.props
	// 	const { versesContent } = this.state

	// 	if (verses !== nextProps.verses) {
	// 		this.setState({
	// 			versesContent: Immutable.fromJS(versesContent).merge(nextProps.verses).toJS(),
	// 		})
	// 	}
	// }

	// addVerse(versionID, references) {
	// 	const { dispatch } = this.props
	// 	const { versesContent } = this.state

	// 	dispatch(ActionCreators.bibleVerses({ id: versionID, references: references, format: 'html' }))
	// }

	// deleteVerse(key) {
	// 	const { versesContent } = this.state
	// 	if (key in versesContent) {
	// 		this.setState({
	// 			versesContent: Immutable.fromJS(versesContent).delete(key).toJS(),
	// 		})
	// 	}
	// }


	render() {
		const { versesContent, verseHeading, deleteVerse, intl } = this.props

		let verses = []
		let cardFooter = null

		if (Object.keys(versesContent).length > 0) {
			Object.keys(versesContent).forEach((key) => {
				let verse = versesContent[key]
				let heading = verseHeading ? verseHeading : <h2 className='heading'>{ `${ verse.heading }` }</h2>

				if (deleteVerse) {
					verses.push (
						<div key={key} className='verse'>
							{ heading }
							<div className='verse-content' dangerouslySetInnerHTML={{ __html: verse.content }}/>
							<XMark width={18} height={18} onClick={deleteVerse.bind(this, key)}/>
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
 * @versesContent 		{object} 			verse references to display on card
 * @deleteVerse				{function}		display X and call function on click
 */
VerseCard.propTypes = {
	versesContent: React.PropTypes.array,
	deleteVerse: React.PropTypes.func,
}

export default injectIntl(VerseCard)