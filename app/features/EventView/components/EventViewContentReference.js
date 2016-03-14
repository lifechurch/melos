import React, { Component, PropTypes } from 'react'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import ActionCreators from '../../EventEdit/features/content/actions/creators'

class EventViewContentReference extends Component {

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
			var verse = doc.evaluate(xPathExpression, doc, null, XPathResult.ANY_TYPE, null)

			var nextSection = verse.iterateNext()
			var output = []
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
		var { chapter, human, version_abbreviation  } = contentData

		human = human.split(':')[0] + ":" + human.split(',').map((x) => { return x.split(':')[1] }).join(', ')

		var verses = []
		if (contentData.usfm && chapter && chapter.length) {
			try {
				var previous_number
				for (let usfm of contentData.usfm) {
					var verse = ::this.parseVerseFromChapter(usfm)
					var verse_number = usfm.split('.').pop() + " "
					if (previous_number && (previous_number != (verse_number-1))) {
						verses.push( <br key={verse_number.trim() + ".br"}/> )
					}
					verses.push( <span key={verse_number.trim() + ".vn"} className="verseNumber">{verse_number}</span> )
					verses.push( <span key={verse_number.trim() + ".vc"} className="verseContent">{verse + " "}</span> )
					previous_number = verse_number
				}
			} catch (err) {
				verses = [<span className="errorText">{err}</span>]
			}
		}

		return (
			<div className='content reference'>
				<div className='title'>{human} <span className="version">{version_abbreviation}</span></div>
				<p>{verses}</p>
			</div>
		)
	}

}

EventViewContentReference.propTypes = {

}

export default EventViewContentReference
