import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import ActionCreators from '../../content/actions/creators'

class PreviewTypeReference extends Component {

	componentWillMount(){
		const { dispatch, contentIndex, contentData, reference } = this.props

		dispatch(ActionCreators.getChapter({
			'index': contentIndex,
			'id': contentData.version_id,
			'reference': contentData.usfm[0].substring(0, contentData.usfm[0].lastIndexOf('.'))
		}))

	}

	parseVerseFromChapter(usfm) {
		const { contentData } = this.props
		if (contentData.hasOwnProperty('chapter')) {
			var fullChapter = contentData['chapter']
			var doc = new DOMParser().parseFromString(fullChapter, 'text/html')
			var xPathExpression = "//div/div/div/span[contains(concat('+',@data-usfm,'+'),'+" + usfm +
									"+')]/node()[not(contains(concat(' ',@class,' '),' note '))][not(contains(concat(' ',@class,' '),' label '))]"
			var verse = doc.evaluate(xPathExpression, doc, null, XPathResult.STRING_TYPE, null).stringValue
			if (verse) {
				return verse
			} else {
				throw "This version does not contain that reference"
			}
		} else {
			throw ''
		}
	}

	render() {
		const { contentData, reference } = this.props
		var { chapter, human } = contentData

		human = human.split(':')[0] + ":" + human.split(',').map((x) => { return x.split(':')[1] }).join(', ')

		var verses = []
		if (contentData.usfm && chapter && chapter.length) {
			try {
				for (let usfm of contentData.usfm) {
					var verse = ::this.parseVerseFromChapter(usfm)
					verses.push( <span className="verseNumber">{usfm.split('.').pop() + " "}</span> )
					verses.push( <span className="verseContent">{verse + " "}</span> )
				}
			} catch (err) {
				verses = [<span className="errorText">{err}</span>]
			}
		}

		return (
			<div className='type reference'>
				<b>{human}</b><br/>
				<p>{verses}</p>
				<div className='meta'>
					<div className='notes'>Add your notes…</div>
					<div className='actions'>&bull; &bull; &bull;</div>
				</div>
			</div>
		)
	}

}

PreviewTypeReference.propTypes = {

}

export default PreviewTypeReference
