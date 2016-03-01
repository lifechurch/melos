import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'
import HtmlEditor from '../../../../../../app/components/HtmlEditor'

class ContentTypeReference extends Component {

	componentWillMount() {
		const { dispatch, references, contentIndex, contentData } = this.props

		if (Object.keys(references.versions).length == 1) {
			dispatch(ActionCreators.getVersions({'language_tag': 'eng', 'type': 'all'}))
		}

		if (contentData.version_id != 1) {
			dispatch(ActionCreators.setVersion({
				'language_tag': 'eng',
				'id': contentData.version_id,
				'index': contentIndex
			}))
		}

		var usfm_sections = contentData.usfm[0].split('.')
		if (usfm_sections.length > 1) {
			dispatch(ActionCreators.getChapter({
				'index': contentIndex,
				'id': contentData.version_id,
				'reference': usfm_sections[0] + "." + usfm_sections[1]
			}))
		}
	}

	componentDidUpdate() {
		const { contentData, autoSave } = this.props
		const { usfm } = contentData

		if (::this.validateVerses(usfm)) {
			autoSave()
		}
	}

	handleVersionChange(event) {
		const { dispatch, contentIndex, contentData } = this.props
		dispatch(ActionCreators.setVersion({
			'language_tag': 'eng',
			'id': parseInt(event.target.value),
			'index': contentIndex
		}))

		var ch_ref = contentData.usfm[0].split('.')
		dispatch(ActionCreators.getChapter({
			'index': contentIndex,
			'id': parseInt(event.target.value),
			'reference': ch_ref[0] + "." + ch_ref[1]
		}))
	}

	handleBookChange(event) {
		const { dispatch, contentIndex, contentData, references } = this.props
		const books = references.books[contentData.version_id]
		const afterBookUsfm = event.target.value
		const beforeBookUsfm = contentData.usfm[0].split('.')[0]
		const chapterVerse = contentData.human.split(' ').pop()

		var usfm = contentData.usfm.map((usfm) => {
			return usfm.replace(beforeBookUsfm, afterBookUsfm)
		})

		var humanBookName = ""
		for (let book of books) {
			if (book.usfm == afterBookUsfm) {
				humanBookName = book.name
				break
			}
		}

		dispatch(ActionCreators.getChapter({
			'index': contentIndex,
			'id': contentData.version_id,
			'reference': afterBookUsfm + "." + chapterVerse.split(':')[0]
		}))

		dispatch(ActionCreators.setReference({
			'usfm': usfm,
			'human': humanBookName + " " + chapterVerse,
			'index': contentIndex
		}))
	}

	updateContent(event) {
		const { contentIndex, contentData, dispatch, references } = this.props
		const chapterVerses = event.target.value.replace(/\s/g, '').split(':')

		// Find long-form book name from usfm
		const books = references.books[contentData.version_id]
		const usfm_book = contentData.usfm[0].split('.')[0]
		var human_book = ''
		for (var i in books) {
			if (books[i].usfm == usfm_book) {
				var human_book = books[i].name
				break
			}
		}

		// Build usfms
		var usfm = new Set()
		if (chapterVerses.length < 2 || chapterVerses[1] == "") {
			// var chapter = parseInt(chapterVerses[0].replace(human_book + ' ', ''))
			// if (!isNaN(chapter)) {
			// 	usfm.add(usfm_book + "." + chapter)
			// }
			dispatch(ActionCreators.clearChapter({'index': contentIndex}))

		} else {
			var ch = chapterVerses[0]

			// for each set of individual verses, or verse ranges…
			var csv_vrs = chapterVerses[1].split(',')
			for (var i=0; i < csv_vrs.length; i++) {

				// …add the verse, or each verse in the range
				var v_range = csv_vrs[i].split('-')
				if (v_range.length == 1) {
					usfm.add(usfm_book+'.'+ch+'.'+v_range[0])
				} else {
					var from = Math.min.apply(Math, v_range)
					var to = Math.max.apply(Math, v_range)
					for (var j=from; j <= to; j++) {
						usfm.add(usfm_book+'.'+ch+'.'+j)
					}
				}
			}

			dispatch(ActionCreators.getChapter({
				'index': contentIndex,
				'id': contentData.version_id,
				'reference': usfm_book + "." + ch
			}))

			////////////////////////////////////////////////////////////
			// START // move outside of else, if chapter is ever allowed
			var usfms = []
			for (let u of usfm) {
				usfms.push(u)
			}
			// sort on verse only, not full usfm
			usfm = usfms.sort(function(a, b){ return a.split('.')[2] - b.split('.')[2] })

			// Build long-form human reference. i.e., "Jude 1:1, Jude 1:3-4"
			var human = []
			if (chapterVerses.length > 1) {
				var chapter = chapterVerses[0]
				var verses = chapterVerses[1].split(',')
				for (var j in verses) {
					human.push(human_book + " " + chapter + ":" + verses[j])
				}

			} else {
				human.push(human_book + " " + chapterVerses.join(':'))
			}
			human = human.join(', ')

			dispatch(ActionCreators.setReference({
				'usfm': [...usfm],
				'human': human,
				'index': contentIndex
			}))
			// END //
			/////////
		}

	}

	validateVerses(usfmVerses) {
		for (let verse of usfmVerses) {
			try {
				::this.parseVerseFromChapter(verse)
			} catch (err) {
				return false
			}
		}
		return true
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

	getHumanChapterVerse(contentData) {
		const { human, usfm } = contentData
		var chapterVerse = ''
		if (usfm.length) {
			var chv = usfm[0].split('.')
			chapterVerse = chv.length > 1 ? chv[1] + ":" : ""
			chapterVerse += human.split(',').map(function(i){ return i.split(':')[1]; }).join(', ')
		}
		return chapterVerse
	}

	render() {
		const { references, contentData, isFetching } = this.props
		const { version_id, chapter } = contentData
		const book = contentData.usfm[0].split('.')[0]
		var chv = ::this.getHumanChapterVerse(contentData)

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

		var versions = []
		for (var i in references.versions) {
			versions.push( <option key={references.versions[i].abbreviation} value={i}>{references.versions[i].abbreviation.toUpperCase()}</option> )
		}

		var books = []
		if (Array.isArray(references.books[version_id])) {
			books = references.books[version_id].map((b) => {
				return <option key={b.name} value={b.usfm}>{b.name}</option>
			})
		}

		return (
			<div>
				<div className='form-body-block white'>
					<Row>
						<Column s='small-3'>
							<select name='version_id' disabled={isFetching} value={version_id} onChange={::this.handleVersionChange}>
								{versions}
							</select>
							<div className='selectTitle'>
								Version
							</div>
						</Column>
						<Column s='small-6'>
							<select name='book' disabled={isFetching} value={book} onChange={::this.handleBookChange}>
								<option value={"NO_BOOK"}></option>
								{books}
							</select>
							<div className='selectTitle'>
								Book
							</div>
						</Column>
						<Column s='small-3'>
							<FormField
								InputType={Input}
								name="chv"
								disabled={isFetching}
								onChange={::this.updateContent}
								value={chv}
								errors={contentData.errors} />
							<div className='selectTitle'>
								Chapter:Verse
							</div>
						</Column>
					</Row>
					<Row>
						<div className="verseText">
							{verses}
						</div>
					</Row>
				</div>
			</div>
		)
	}
}

ContentTypeReference.propTypes = {

}

export default ContentTypeReference
