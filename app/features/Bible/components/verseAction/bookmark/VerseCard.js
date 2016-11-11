import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../../actions/creators'
import Card from '../../../../../components/Card'

class VerseCard extends Component {

	constructor(props) {
		super(props)
		this.state = {
			verseContent: null,
			heading: null
		}
	}

	componentDidMount() {
		const { references, version, dispatch } = this.props
		dispatch(ActionCreators.bibleVerses({ id: version, references: references, format: 'html' })).then((verses) => {
			let content = []
			let heading = []
			console.log(verses)
			verses.verses.forEach((verse) => {
				content.push(verse.content)
				heading.push(verse.reference.human)
			})
			this.setState({ verseContent: content, heading: heading })
		})
	}


	render() {

		const { verseContent, heading } = this.state
		console.log(verseContent)
		return (
			<div className=''>
				<Card>
					<h4>{ heading }</h4>
					<div
						className='verse-content'
						dangerouslySetInnerHTML={{ __html: verseContent }}

					/>
				</Card>
			</div>
		)
	}
}

VerseCard.propTypes = {

}

export default VerseCard