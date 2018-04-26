import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ActionCreators from '../actions/creators'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'
import HtmlEditor from '../../../../../../app/components/HtmlEditor'
import LocaleList from '../../../../../../locales/config/localeList.json'
import cookie from 'react-cookie'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

class ContentTypeReference extends Component {
	constructor(props) {
		super(props)
		this.state = { loadingVersions: false }
	}

	componentWillMount() {
		const { dispatch, references, contentIndex, contentData } = this.props
		const usfm_sections = contentData.usfm[0].split('.')
		if (usfm_sections.length > 1) {
			dispatch(ActionCreators.getChapter({
				index: contentIndex,
				id: contentData.version_id,
				reference: `${usfm_sections[0]}.${usfm_sections[1]}`
			}))
		}

		if (typeof contentData.language_tag !== 'undefined' && !this.state.loadingVersions && typeof references.versions[contentData.language_tag] === 'undefined') {
			this.setState({ loadingVersions: true })
			dispatch(ActionCreators.getVersions({ language_tag: contentData.language_tag, type: 'all', index: contentIndex }))
		}
	}

	componentWillReceiveProps(nextProps) {
		const { dispatch, references, contentData, contentIndex } = nextProps

		// Need to Set Language Based on Version in State
		if (typeof contentData.language_tag === 'undefined' && typeof references.langs[contentData.version_id] !== 'undefined') {
			dispatch(ActionCreators.setLang({
				language_tag: references.langs[contentData.version_id],
				index: contentIndex
			}))
		}

		// Need to Fetch Books for this Version
		if (contentData.version_id !== null && typeof references.books[contentData.version_id] === 'undefined') {
			dispatch(ActionCreators.setVersion({
				id: contentData.version_id,
				index: contentIndex
			}))
		}

		// Need to Fetch Versions for this Language
		if (typeof contentData.language_tag !== 'undefined' && !this.state.loadingVersions && typeof references.versions[contentData.language_tag] === 'undefined') {
			this.setState({ loadingVersions: true })
			dispatch(ActionCreators.getVersions({ language_tag: contentData.language_tag, type: 'all', index: contentIndex }))
		}
	}

	componentDidUpdate() {
		const { contentData, autoSave } = this.props
		const { usfm } = contentData

		if (::this.validateVerses(usfm)) {
			autoSave()
		}
	}

	handleLangChange(event) {
		const { dispatch, contentIndex, contentData } = this.props

		dispatch(ActionCreators.setLang({
			language_tag: event.target.value,
			index: contentIndex
		}))

		cookie.save('last_bible_lang', event.target.value, { maxAge: moment().add(1, 'y').toDate(), path: '/' })
		cookie.remove('last_bible_version')
		cookie.remove('last_bible_book')

		dispatch(ActionCreators.getVersions({ language_tag: event.target.value, type: 'all', index: contentIndex }))
		dispatch(ActionCreators.setField({ index: contentIndex, field: 'human', value: ' ' }))
		dispatch(ActionCreators.setField({ index: contentIndex, field: 'chapter', value: '' }))
		dispatch(ActionCreators.setField({ index: contentIndex, field: 'usfm', value: [''] }))
	}

	handleVersionChange(event) {
		const { dispatch, contentIndex, contentData } = this.props
		dispatch(ActionCreators.setVersion({
			id: parseInt(event.target.value),
			index: contentIndex
		}))

		cookie.save('last_bible_version', parseInt(event.target.value), { maxAge: moment().add(1, 'y').toDate(), path: '/' })
		cookie.remove('last_bible_book')

		dispatch(ActionCreators.setField({ index: contentIndex, field: 'human', value: ' ' }))
		dispatch(ActionCreators.setField({ index: contentIndex, field: 'chapter', value: '' }))
		dispatch(ActionCreators.setField({ index: contentIndex, field: 'usfm', value: [''] }))
	}

	handleBookChange(event) {
		const { dispatch, contentIndex, contentData, references } = this.props
		const books = references.books[contentData.version_id]
		const usfm = event.target.value

		cookie.save('last_bible_book', event.target.value, { maxAge: moment().add(1, 'y').toDate(), path: '/' })

		let human = ''
		for (const book of books) {
			if (book.usfm == usfm) {
				human = `${book.name} `
				break
			}
		}

		dispatch(ActionCreators.setField({ index: contentIndex, field: 'human', value: human }))
		dispatch(ActionCreators.setField({ index: contentIndex, field: 'chapter', value: '' }))
		dispatch(ActionCreators.setField({ index: contentIndex, field: 'usfm', value: [usfm] }))
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
		let usfm = new Set()
		if (chapterVerses.length < 2 || chapterVerses[1] == '') {
			// var chapter = parseInt(chapterVerses[0].replace(human_book + ' ', ''))
			// if (!isNaN(chapter)) {
			// 	usfm.add(usfm_book + "." + chapter)
			// }
			dispatch(ActionCreators.clearChapter({ index: contentIndex }))

		} else {
			const ch = chapterVerses[0]

			// for each set of individual verses, or verse ranges…
			const csv_vrs = chapterVerses[1].split(',')
			for (var i = 0; i < csv_vrs.length; i++) {

				// …add the verse, or each verse in the range
				const v_range = csv_vrs[i].split('-')
				if (v_range.length == 1) {
					usfm.add(`${usfm_book}.${ch}.${v_range[0]}`)
				} else {
					const from = Math.min(...v_range)
					const to = Math.max(...v_range)
					for (var j = from; j <= to; j++) {
						usfm.add(`${usfm_book}.${ch}.${j}`)
					}
				}
			}

			dispatch(ActionCreators.getChapter({
				index: contentIndex,
				id: contentData.version_id,
				reference: `${usfm_book}.${ch}`
			}))

			// //////////////////////////////////////////////////////////
			// START // move outside of else, if chapter is ever allowed
			const usfms = []
			for (const u of usfm) {
				usfms.push(u)
			}
			// sort on verse only, not full usfm
			usfm = usfms.sort((a, b) => { return a.split('.')[2] - b.split('.')[2] })

			// Build long-form human reference. i.e., "Jude 1:1, Jude 1:3-4"
			let human = []
			if (chapterVerses.length > 1) {
				const chapter = chapterVerses[0]
				const verses = chapterVerses[1].split(',')
				for (var j in verses) {
					human.push(`${human_book} ${chapter}:${verses[j]}`)
				}

			} else {
				human.push(`${human_book} ${chapterVerses.join(':')}`)
			}
			human = human.join(', ')

			dispatch(ActionCreators.setReference({
				usfm: [...usfm],
				human,
				index: contentIndex
			}))
			// END //
			// ///////
		}

	}

	validateVerses(usfmVerses) {
		for (const verse of usfmVerses) {
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
			const fullChapter = contentData.chapter
			const doc = new DOMParser().parseFromString(fullChapter, 'text/html')
			const xPathExpression = `//div/div/div/span[contains(concat('+',@data-usfm,'+'),'+${usfm}+')]` +
								  '/node()[not(contains(concat(\' \',@class,\' \'),\' note \'))][not(contains(concat(\' \',@class,\' \'),\' label \'))]'
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

	getHumanChapterVerse(contentData) {
		const { human, usfm } = contentData
		let chapterVerse = ''
		if (usfm.length) {
			const chv = usfm[0].split('.')
			chapterVerse = chv.length > 1 ? `${chv[1]}:` : ''
			chapterVerse += human.split(',').map((i) => { return i.split(':')[1]; }).join(', ')
		}
		return chapterVerse
	}

	render() {
		const { references, contentData, isFetching, intl } = this.props
		const { version_id, chapter, language_tag } = contentData
		const book = contentData.usfm[0].split('.')[0]
		const chv = ::this.getHumanChapterVerse(contentData)

		let verses = []
		if (contentData.usfm && chapter && chapter.length) {
			try {
				let previous_number
				for (const usfm of contentData.usfm) {
					const verse = ::this.parseVerseFromChapter(usfm)
					const verse_number = `${usfm.split('.').pop()} `
					if (previous_number && (previous_number != (verse_number - 1))) {
						verses.push(<br key={`${verse_number}_br`} />)
					}
					verses.push(<span key={`${verse_number}_number`} className="verseNumber">{verse_number}</span>)
					verses.push(<span key={`${verse_number}_verse`} className="verseContent">{`${verse} `}</span>)
					previous_number = verse_number
				}
			} catch (err) {
				 verses = null // [<span className="errorText">{err}</span>]
			}
		}

		const versions = []
		if (typeof references.versions[language_tag] !== 'undefined' && typeof references.order[language_tag] !== 'undefined') {
			for (const i in references.order[language_tag]) {
				const ordered_id = references.order[language_tag][i]
				const versionList = references.versions[language_tag]
				if (typeof versionList[ordered_id] !== 'undefined') {
					const title = versionList[ordered_id].local_title || versionList[ordered_id].title
					const abbr = versionList[ordered_id].abbreviation || ''
					const display = `${title} - ${abbr.toUpperCase()}`
					versions.push(<option key={versionList[ordered_id].id} value={ordered_id}>{display}</option>)
				}
			}
		}

		const langs = LocaleList.map((l) => {
			return (<option key={l.locale} value={l.locale3}>{l.displayName}</option>)
		})

		let books = []
		if (Array.isArray(references.books[version_id])) {
			books = references.books[version_id].map((b) => {
				return <option key={b.usfm} value={b.usfm}>{b.name}</option>
			})
		}

		return (
			<div>
				<div className='form-body-block white'>
					<Row>
						<Column s='small-3'>
							<select name='language_tag' disabled={isFetching} value={language_tag} onChange={::this.handleLangChange}>
								<option value={'NO_LANG'} />
								{langs}
							</select>
							<div className='selectTitle'>
								<FormattedMessage id="features.EventEdit.features.content.components.ContentTypeReference.language" />
							</div>
						</Column>
						<Column s='small-3'>
							<select name='version_id' disabled={isFetching} value={version_id} onChange={::this.handleVersionChange}>
								<option value={'NO_VERSION'} />
								{versions}
							</select>
							<div className='selectTitle'>
								<FormattedMessage id="features.EventEdit.features.content.components.ContentTypeReference.version" />
							</div>
						</Column>
						<Column s='small-3'>
							<select name='book' disabled={isFetching} value={book} onChange={::this.handleBookChange}>
								<option value={'NO_BOOK'} />
								{books}
							</select>
							<div className='selectTitle'>
								<FormattedMessage id="features.EventEdit.features.content.components.ContentTypeReference.book" />
							</div>
						</Column>
						<Column s='small-3'>
							<FormField
								InputType={Input}
								name="chv"
								disabled={isFetching || !book.length}
								onChange={::this.updateContent}
								value={chv}
								errors={contentData.errors}
							/>
							<div className='selectTitle'>
								<FormattedMessage id="features.EventEdit.features.content.components.ContentTypeReference.chapterVerse" />
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
