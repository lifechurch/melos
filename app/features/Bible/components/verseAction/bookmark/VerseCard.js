import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../../actions/creators'
import Card from '../../../../../components/Card'
import XMark from '../../../../../components/XMark'
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
			references,
			version
		} = this.props

		if (version && references) {
			this.addVerse(version, references)
		}
	}

	addVerse(versionID, references) {
		const { dispatch } = this.props
		const { verseContent } = this.state

		dispatch(ActionCreators.bibleVerses({ id: versionID, references: references, format: 'html' })).then((verses) => {
			let content = {}
			verses.verses.forEach((verse) => {
				content[verse.reference.usfm] = { content: verse.content, heading: ` ${verse.reference.human}` }
			})
			this.setState({
				verseContent: Immutable.fromJS(verseContent).merge(content).toJS(),
			})
			console.log(verses)
		})
	}

	deleteVerse(usfm) {
		const { verseContent } = this.state
		if (usfm in verseContent) {
			this.setState({
				verseContent: Immutable.fromJS(verseContent).delete(usfm).toJS(),
			})
		}
	}


	render() {
		const { canDeleteVerses, canAddVerses, versionAbbr } = this.props
		const { verseContent } = this.state

		let verses = []
		let cardFooter = null

		if (Object.keys(verseContent).length > 0) {
			Object.keys(verseContent).forEach((key) => {
				let verse = verseContent[key]
				if (canDeleteVerses) {
					verses.push (
						<div key={key} className='vertical-center verse'>
							<div className='heading'>{ `${verse.heading} ${versionAbbr.toUpperCase()}` }</div>
							<div className='verse-content' dangerouslySetInnerHTML={{ __html: verse.content }}/>
							<XMark width={18} height={18} onClick={this.deleteVerse.bind(this, key)}/>
						</div>
					)
				} else {
					verses.push (
						<div key={key} className='verse'>
							<div className='heading'>{ `${verse.heading} ${versionAbbr.toUpperCase()}` }</div>
							<div className='verse-content' dangerouslySetInnerHTML={{ __html: verse.content }}/>
						</div>
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

export default VerseCard