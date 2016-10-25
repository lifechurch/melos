import React, { Component, PropTypes } from 'react'
import Audio from './audio/Audio'
import Header from './header/Header'
import Settings from './settings/Settings'
import VerseAction from './verseAction/VerseAction'
import { connect } from 'react-redux'
import ActionCreators from '../actions/creators'
import Filter from '../../../lib/filter'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Books from './chapterPicker/Books'
import Chapters from './chapterPicker/Chapters'
import Languages from './versionPicker/Languages'
import Versions from './versionPicker/Versions'
import cookie from 'react-cookie';
import moment from 'moment'
import Label from './chapterPicker/Label'
import LabelPill from './verseAction/bookmark/LabelPill'
import Color from './verseAction/Color'
import ChapterPicker from './chapterPicker/ChapterPicker'
import VersionPicker from './versionPicker/VersionPicker'


class Bible extends Component {

	constructor(props) {
		super(props)
		const { bible } = props
		this.state = {
			selectedBook: bible.chapter.reference.usfm.split('.')[0],
			selectedChapter: bible.chapter.reference.usfm,
			selectedVersion: bible.chapter.reference.version_id,
			selectedLanguage: bible.versions.selectedLanguage,
			chapter: bible.chapter,
			chapterError: false,
			dbReady: false,
			db: null,
			results: [],
			versions: []
		}

		this.chapterPicker = null
		this.versionsss = null
		this.versionPicker = null
		this.color = null
		this.content = null
	}

	getVersions(languageTag) {
		const { dispatch } = this.props
		const comp = this
		this.setState({ selectedLanguage: languageTag })

		dispatch(ActionCreators.bibleVersions({ language_tag: languageTag, type: 'all' })).then((versions) => {
			console.time("Build Versions Index")
			Filter.build("VersionStore", [ "title", "local_title", "abbreviation" ])
			console.timeEnd("Build Versions Index")

			console.time("Add V Items")
			Filter.add("VersionStore", versions.versions)
			console.timeEnd("Add V Items")
		})

		// dispatch(ActionCreators.bibleConfiguration()).then((config) => {
		// 	console.time("Build Index")
		// 	Filter.build("LangStore", [ "name", "local_name" ])
		// 	console.timeEnd("Build Index")

		// 	console.time("Add Items")
		// 	Filter.add("LangStore", config.default_versions)
		// 	console.timeEnd("Add Items")
		// })

		// dispatch(ActionCreators.loadVersionAndChapter({ id: 100, reference: this.state.selectedChapter }))
		// dispatch(ActionCreators.momentsColors())
	}

	getVC(versionID) {
		const { dispatch, bible } = this.props
		this.setState({ selectedVersion: versionID })
		dispatch(ActionCreators.loadVersionAndChapter({ id: versionID, reference: this.state.selectedChapter }))
	}

	getBook(book) {
		this.setState({ selectedBook: book.usfm })
		this.toggleChapterPickerList()
	}

	getChapter(versionid, chapterusfm) {
		const { dispatch, bible } = this.props
		this.setState({ selectedChapter: chapterusfm })
		this.toggleChapterPickerList()
		dispatch(ActionCreators.loadVersionAndChapter({ id: versionid, reference: chapterusfm }))
		// then write cookie for selected chapter
		cookie.save('last_read', chapterusfm, { maxAge: moment().add(1, 'y').toDate(), path: '/' })
	}

	getVersion(version) {
		const { dispatch, bible } = this.props
		console.log(version)
		this.setState({ selectedVersion: version.id })
		this.toggleVersionPickerList()
		dispatch(ActionCreators.bibleChapter({ id: version.id, reference: this.state.selectedChapter}))
		// then write cookie for selected version
		cookie.save('version', version.id, { maxAge: moment().add(1, 'y').toDate(), path: '/' })
	}


	getLanguage(language) {

	}

	handleLabelChange(inputValue) {
		// const { books, bookMap } = this.props
		// const { selectedBook } = this.state

		// filter the books given the input change
		// let results = Filter.filter("BooksStore", inputValue.trim())

		this.setState({ inputValue: inputValue })

	}

	handleLabelKeyDown(event, keyEventName, keyEventCode) {
		// const { books, bookMap } = this.props
		// const {
		// 	inputValue,
		// 	booklistSelectionIndex,
		// 	chapterlistSelectionIndex,
		// 	selectedBook
		// } = this.state

	}

	// this handles the class toggling for book and chapter clicks on mobile
	toggleChapterPickerList() {
		(this.state.classes) == 'hide-chaps' ? this.setState({ classes: 'hide-books' }) : this.setState({ classes: 'hide-chaps' })
	}

	toggleVersionPickerList() {
		(this.state.classes) == 'hide-langs' ? this.setState({ classes: 'hide-versions' }) : this.setState({ classes: 'hide-langs' })
	}


	filterLang(changeEvent) {
		const filter = changeEvent.target.value;
		const instance = this
		console.time("Filter Items")
		const results = Filter.filter("LangStore", filter)
		console.timeEnd("Filter Items")
		instance.setState({ results })
	}

	filterVersions(changeEvent) {
		const filter = changeEvent.target.value;
		const instance = this
		console.time("Filter V Items")
		const versions = Filter.filter("VersionStore", filter)
		console.timeEnd("Filter V Items")
		instance.setState({ versions })
	}

	labelSelect(label) {
		console.log('select', label)
	}

	labelDelete(label) {
		console.log('delete', label)
	}

	getColor(color) {
		console.log(color)
	}

	componentDidUpdate(prevProps, prevState) {
		const { bible } = this.props
		const { chapter } = this.state

		// if (bible.chapter.content != prevProps.bible.chapter.content) {
		// 	// if the new chapter call was successful, then let's render the new chapter
		// 	if (bible.chapter.content) {
		// 		this.setState({
		// 			chapter: bible.chapter,
		// 			chapterError: false
		// 		})
		// 	} else {
		// 		// if it isn't valid, then keep the previous chapter rendered, and then let the
		// 		// version picker know there was an error
		// 		this.setState({
		// 			chapterError: true
		// 		})
		// 	}
		// }
		if (bible.chapter != prevProps.bible.chapter) {
			if (bible.chapter.errors) {
				this.setState({ chapterError: true, chapter: prevProps.bible.chapter })
			} else {
				this.setState({ chapterError: false, chapter: bible.chapter })
			}
		}

	}

	render() {
		const { bible, audio, settings, verseAction } = this.props
		const { results, versions } = this.state


		if (Array.isArray(bible.books.all) && bible.books.map && this.state.chapter && this.state.chapter.reference) {
			console.log(this.state.chapter)
			this.chapterPicker = (
				<ChapterPicker
					{...this.props}
					chapter={this.state.chapter}
					books={bible.books.all}
					bookMap={bible.books.map}
					selectedLanguage={this.state.selectedLanguage}
					getChapter={::this.getChapter}
				/>
			)
		}



		if (Array.isArray(bible.languages.all) && bible.languages.map && this.state.chapter && bible.version.abbreviation ) {
			this.versionPicker = (
				<VersionPicker
					{...this.props}
					version={bible.version}
					languages={bible.languages.all}
					versions={bible.versions}
					languageMap={bible.languages.map}
					selectedChapter={this.state.chapter.reference ? this.state.chapter.reference.usfm : this.state.selectedChapter}
					alert={this.state.chapterError}
					getChapter={::this.getChapter}
					getVersions={::this.getVersions}
				/>
			)
		}

		if (Array.isArray(bible.highlightColors)) {
			this.color = (
				<div>
					<Color color={bible.highlightColors[3]} onSelect={::this.getColor} />
					<Color color={bible.highlightColors[7]} onSelect={::this.getColor} />
					<Color color={bible.highlightColors[13]} onSelect={::this.getColor} />
				</div>
			)
		}

		if (this.state.chapterError) {
			this.content = <h2>Oh nooooooooo</h2>
		} else {
			this.content = <div dangerouslySetInnerHTML={{ __html: bible.chapter.content }} />
		}

		return (
			<div className="row">
				<div>
					<div className='row'>
						<div className="columns medium-12 vertical-center">
							{ this.chapterPicker }
							{ this.versionPicker }
						</div>
						<br/>
						<br/>
						<br/>
						<br/>
						<div className="columns medium-8">
							{ this.content }
						</div>
					</div>

					<div className="row">
					<Header {...this.props} />
					<Audio audio={audio} />
					<Settings settings={settings} />
					<VerseAction verseAction={verseAction} />

						<div className="columns medium-3">
							<LabelPill label='Righteous' canDelete={false} onDelete={::this.labelDelete} onSelect={::this.labelSelect} count={26} active={false} />
							<LabelPill label='Holy' canDelete={false} onDelete={::this.labelDelete} onSelect={::this.labelSelect} count={6} active={true} />
							<LabelPill label='Peace' canDelete={true} onDelete={::this.labelDelete} onSelect={::this.labelSelect} count={1} active={false} />
							{ this.color }
						</div>
					</div>
				</div>
			</div>
		)
	}
							// <input onChange={::this.filterLang} />
							// <ul>
							// 	{/*resultItems*/}
							// </ul>
}

Bible.propTypes = {
	bible: PropTypes.object.isRequired
}

export default Bible