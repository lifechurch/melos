import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../../actions/creators'
import Card from '../../../../../components/Card'
import XMark from '../../../../../components/XMark'

class VerseCard extends Component {

	constructor(props) {
		super(props)
		this.state = {
			verseContent: {},
			headingContent: {}
		}
	}

	componentDidMount() {
		const {
			references,
			version,
			dispatch
		} = this.props

		dispatch(ActionCreators.bibleVerses({ id: version, references: references, format: 'html' })).then((verses) => {
			let content = {}
			let heading = {}
			console.log(verses)
			verses.verses.forEach((verse) => {
				content[verse.reference.usfm] = verse.content
				heading[verse.reference.usfm] = ` ${verse.reference.human}`
			})
			this.setState({ verseContent: content, headingContent: heading })
		})
	}


	render() {
		const { canDeleteVerse, versionAbbr } = this.props
		const { verseContent, headingContent } = this.state

		let verses = []
		let headings = []

		if (Object.keys(verseContent).length > 0) {
			Object.keys(verseContent).forEach((key) => {
				let verse = verseContent[key]
				verses.push(verse)
			})
		}

		if (Object.keys(headingContent).length > 0) {
			Object.keys(headingContent).forEach((key) => {
				let header = headingContent[key]
				headings.push(header)
			})
		}

		return (
			<Card>
				<div className='verse-card'>
					<div className='heading'>{ `${headings.join(', ')} ${versionAbbr.toUpperCase()}` }</div>
					<div
						className='verse-content'
						dangerouslySetInnerHTML={{ __html: verses.join('&nbsp;') }}
					/>
					<XMark />
					{/* this is for rendering an additional component for specific action
					  (label selector for book mark, reference selector for note, etc)
					*/}
					{ this.props.children }
				</div>
			</Card>
		)
	}
}

VerseCard.propTypes = {

}

export default VerseCard