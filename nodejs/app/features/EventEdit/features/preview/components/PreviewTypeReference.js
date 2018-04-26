import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import ActionCreators from '../../content/actions/creators'
import { FormattedMessage } from 'react-intl'

class PreviewTypeReference extends Component {

	componentWillMount() {
		const { dispatch, contentIndex, contentData, reference } = this.props

		dispatch(ActionCreators.getChapter({
			index: contentIndex,
			id: contentData.version_id,
			reference: contentData.usfm[0].substring(0, contentData.usfm[0].lastIndexOf('.'))
		}))

	}

	parseVerseFromChapter(usfm) {
		const { contentData } = this.props
		if (contentData.hasOwnProperty('chapter')) {
			const fullChapter = contentData.chapter
			const doc = new DOMParser().parseFromString(fullChapter, 'text/html')
			const xPathExpression = `//div/div/div/span[contains(concat('+',@data-usfm,'+'),'+${usfm
									}+')]/node()[not(contains(concat(' ',@class,' '),' note '))][not(contains(concat(' ',@class,' '),' label '))]`
			const verse = doc.evaluate(xPathExpression, doc, null, XPathResult.ANY_TYPE, null)

			let nextSection = verse.iterateNext()
			const output = []
			while (nextSection) {
				output.push(nextSection.textContent)
				nextSection = verse.iterateNext()
			}

			if (output.length) {
				return output.join('')
			} else {
				throw ''
			}
		} else {
			throw ''
		}
	}

	render() {
		const { contentData, reference } = this.props
		let { chapter, human, version_abbreviation } = contentData

		human = `${human.split(':')[0]}:${human.split(',').map((x) => { return x.split(':')[1] }).join(', ')}`

		let verses = []
		if (contentData.usfm && chapter && chapter.length) {
			try {
				let previous_number
				for (const usfm of contentData.usfm) {
					const verse = ::this.parseVerseFromChapter(usfm)
					const verse_number = `${usfm.split('.').pop()} `
					if (previous_number && (previous_number != (verse_number - 1))) {
						verses.push(<br />)
					}
					verses.push(<span className="verseNumber">{verse_number}</span>)
					verses.push(<span className="verseContent">{`${verse} `}</span>)
					previous_number = verse_number
				}
			} catch (err) {
				verses = [<span className="errorText">{err}</span>]
			}
		}

		return (
			<div className='type reference'>
				<div className='human'>{human} <span className="version">{version_abbreviation}</span></div>
				<p>{verses}</p>
				<div className='meta'>
					<div className='notes'><FormattedMessage id="features.EventEdit.features.preview.notes.prompt" /></div>
					<div className='actions'>&bull; &bull; &bull;</div>
				</div>
			</div>
		)
	}

}

PreviewTypeReference.propTypes = {

}

export default PreviewTypeReference
