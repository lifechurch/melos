import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../../actions/creators'
import Card from '../../../../../components/Card'
import XMark from '../../../../../components/XMark'
import { injectIntl, FormattedMessage } from 'react-intl'
import Immutable from 'immutable'

class VerseCard extends Component {

	constructor(props) {
		super(props)
		this.state = {
			verseContent: {},
		}
	}

	componentDidMount() {
		const {
			verses,
			version
		} = this.props

		this.setState({
			verseContent: verses,
		})
	}

	componentWillReceiveProps(nextProps) {
		const { verses } = this.props
		const { verseContent } = this.state

		if (verses !== nextProps.verses) {
			this.setState({
				verseContent: Immutable.fromJS(verseContent).merge(nextProps.verses).toJS(),
			})
		}
	}

	addVerse(versionID, references) {
		const { dispatch } = this.props
		const { verseContent } = this.state

		dispatch(ActionCreators.bibleVerses({ id: versionID, references: references, format: 'html' }))
	}

	deleteVerse(key) {
		const { verseContent } = this.state
		if (key in verseContent) {
			this.setState({
				verseContent: Immutable.fromJS(verseContent).delete(key).toJS(),
			})
		}
	}


	render() {
		const { canDeleteVerses, canAddVerses, verseHeading, intl } = this.props
		const { verseContent } = this.state

		let verses = []
		let cardFooter = null

		if (Object.keys(verseContent).length > 0) {
			Object.keys(verseContent).forEach((key) => {
				let verse = verseContent[key]
				let heading = verseHeading ? verseHeading : <h2 className='heading'>{ `${ verse.human }` }</h2>
				if (canDeleteVerses) {
					verses.push (
						<div key={key} className='vertical-center verse'>
							{ heading }
							<div className='verse-content' dangerouslySetInnerHTML={{ __html: verse.content }}/>
							<XMark width={18} height={18} onClick={this.deleteVerse.bind(this, key)}/>
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
		if (this.props.children || canAddVerses) {
			cardFooter = (
				<div className='card-footer'>
					{/* here we need to render the addReference component
					  whether we can reuse the eventsAdmin one or not */}
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
 * @references 				{array} 			list of verse references to display on card
 * @version    				{number}			version id for refs
 * @versionAbbr				{string}			for displaying version with heading
 * @canDeleteVerses		{bool}				display X and delete verse on click
 * canAddVerses				{bool}				render add reference componenet in card footer
 */
VerseCard.propTypes = {
	references: React.PropTypes.array,
	version: React.PropTypes.number,
	versionAbbr: React.PropTypes.string,
	canDeleteVerses: React.PropTypes.bool,
	canAddVerses: React.PropTypes.bool,
}

export default injectIntl(VerseCard)