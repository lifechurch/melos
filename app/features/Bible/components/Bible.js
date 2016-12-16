import React, { Component, PropTypes } from 'react'
import VerseAction from './verseAction/VerseAction'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import ActionCreators from '../actions/creators'
import Filter from '../../../lib/filter'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import cookie from 'react-cookie';
import moment from 'moment'
import Chapter from './content/Chapter'
import ReaderArrows from './content/ReaderArrows'
import ChapterPicker from './chapterPicker/ChapterPicker'
import VersionPicker from './versionPicker/VersionPicker'
import LabelList from './verseAction/bookmark/LabelList'
import LocalStore from '../../../lib/localStore'
import RecentVersions from '../lib/RecentVersions'
import LabelSelector from './verseAction/bookmark/LabelSelector'
import Header from './header/Header'
import Settings from './settings/Settings'
import AudioPopup from './audio/AudioPopup'
import DropdownTransition from '../../../components/DropdownTransition'
import Immutable from 'immutable'


const DEFAULT_READER_SETTINGS = {
	fontFamily: 'Arial',
	fontSize: 18,
	showFootnotes: true,
	showVerseNumbers: true
}


class Bible extends Component {

	constructor(props) {
		super(props)

		const { bible } = props

		// if we get a bad chapter call, let's grab the first
		//  valid book and chapter for the selected version
		if (!bible.chapter.reference) {
			let chap = bible.books.all[0].chapters[Object.keys(bible.books.all[0].chapters)[0]]
			this.chapterError = true
			this.selectedBook = bible.books.all[0].usfm
			this.selectedChapter = chap.usfm
			this.selectedVersion = bible.version.id
			this.inputValue = `${bible.books.all[0].human} ${chap.human}`
			this.chapters = bible.books.all[0].chapters
		} else {
			this.chapterError = false
			this.selectedBook = bible.chapter.reference.usfm.split('.')[0]
			this.selectedChapter = bible.chapter.reference.usfm
			this.selectedVersion = bible.chapter.reference.version_id
			this.inputValue = bible.chapter.reference.human
			this.chapters = bible.books.all[bible.books.map[bible.chapter.reference.usfm.split('.')[0]]].chapters
		}

		const showFootnoes = LocalStore.getIn("reader.settings.showFootnotes")
		const showVerseNumbers = LocalStore.getIn("reader.settings.showVerseNumbers")

		this.state = {
			selectedBook: this.selectedBook,
			selectedChapter: this.selectedChapter,
			selectedVersion: this.selectedVersion,
			selectedLanguage: bible.versions.selectedLanguage,
			chapterError: this.chapterError,
			dbReady: false,
			chapDropDownCancel: false,
			versionDropDownCancel: false,
			db: null,
			results: [],
			versions: [],
			fontSize: LocalStore.getIn("reader.settings.fontSize") || DEFAULT_READER_SETTINGS.fontSize,
			fontFamily: LocalStore.getIn("reader.settings.fontFamily") || DEFAULT_READER_SETTINGS.fontFamily,
			showFootnotes: typeof showFootnoes === "boolean" ? showFootnoes : DEFAULT_READER_SETTINGS.showFootnotes,
			showVerseNumbers: typeof showVerseNumbers === "boolean" ? showVerseNumbers : DEFAULT_READER_SETTINGS.showVerseNumbers,
			verseSelection: {}
		}

		// Filter.build("BooksStore", [ "human", "usfm" ])
		// Filter.build("VersionStore", [ "title", "local_title", "abbreviation" ])
		// Filter.build("LangStore", [ "name", "local_name" ])

		this.header = null
		this.content = null

		this.chapterPicker = null
		this.versionPicker = null

		this.handleSettingsChange = ::this.handleSettingsChange
		this.handleVerseSelectionClear = ::this.handleVerseSelectionClear
		this.handleVerseSelect = ::this.handleVerseSelect
	}

	getVersions(languageTag) {
		const { dispatch } = this.props
		const comp = this

		this.setState({ selectedLanguage: languageTag })

		dispatch(ActionCreators.bibleVersions({ language_tag: languageTag, type: 'all' })).then((versions) => {
			Filter.clear("VersionStore")
			Filter.add("VersionStore", versions.versions)
		})

		// dispatch(ActionCreators.bibleConfiguration()).then((config) => {
		// 	Filter.add("LangStore", config.default_versions)
		// })
	}

	// getVC(versionID) {
	// 	const { dispatch, bible } = this.props
	// 	this.setState({ selectedVersion: versionID })
	// 	dispatch(ActionCreators.loadVersionAndChapter({ id: versionID, reference: this.state.selectedChapter }))
	// }

	// getBook(book) {
	// 	this.setState({ selectedBook: book.usfm })
	// 	this.toggleChapterPickerList()
	// }

	getChapter(chapterusfm) {
		const { dispatch, bible } = this.props
		this.setState({ selectedChapter: chapterusfm })
		this.chapterVersionCall(this.state.selectedVersion, chapterusfm)
		this.toggleChapterPickerList()

		// then write cookie for selected chapter
		LocalStore.set('last_read', chapterusfm)
	}

	getVersion(versionid) {
		const { dispatch, bible } = this.props
		this.chapterVersionCall(versionid, this.state.selectedChapter)
		this.setState({ selectedVersion: versionid })
		this.toggleVersionPickerList()
		this.recentVersions.add(versionid)

		// then write cookie for selected version
		LocalStore.set('version', versionid)
	}

	chapterVersionCall(versionid, reference) {
		const { dispatch, auth } = this.props

		dispatch(ActionCreators.bibleChapter({ id: versionid, reference: reference}))

		if (auth.isLoggedIn) {
			dispatch(ActionCreators.momentsVerseColors(auth.isLoggedIn, { usfm: reference, version_id: versionid }))
		}

		if (versionid !== this.state.selectedVersion) {
			this.setState({ selectedVersion: versionid })
			dispatch(ActionCreators.bibleVersion({ id: versionid })).then((version) => {
				Filter.clear("BooksStore")
				Filter.add("BooksStore", version.books)
				this.recentVersions.addVersion(version)
			})
		}

		this.handleVerseSelectionClear()
	}

	// this handles the class toggling for book and chapter clicks on mobile
	toggleChapterPickerList() {
		(this.state.classes) == 'hide-chaps' ? this.setState({ classes: 'hide-books' }) : this.setState({ classes: 'hide-chaps' })
	}

	toggleVersionPickerList() {
		(this.state.classes) == 'hide-langs' ? this.setState({ classes: 'hide-versions' }) : this.setState({ classes: 'hide-langs' })
	}

	handleVerseSelect(verseSelection) {
		const { hosts, bible: { version: { id }, chapter: { reference: { human, usfm } } } } = this.props
		const refUrl = `${hosts.railsHost}/${id}/${usfm}.${verseSelection.human}`
		this.setState({ verseSelection: Immutable.fromJS(verseSelection).merge({ chapter: human, url: refUrl, version: id }).toJS() });
	}

	handleVerseSelectionClear() {
		if (typeof this.chapter !== 'undefined') {
			this.chapter.clearSelection()
		}
		this.setState({ verseSelection: {} })
	}


	componentDidUpdate(prevProps, prevState) {
		const { bible } = this.props
		const { chapter } = this.state

		// send error down to pickers
		if (bible.chapter != prevProps.bible.chapter) {
			if (bible.chapter.errors) {
				this.setState({ chapterError: true })
			} else {
				if (bible.chapter.reference && bible.chapter.reference.usfm) {
					this.setState({
						chapterError: false,
						selectedChapter: bible.chapter.reference.usfm,
						inputValue: bible.chapter.reference.human
					})
				}
			}
		}

	}

	handleSettingsChange(key, value) {
		LocalStore.setIn(key, value)
		const stateKey = key.split('.').pop()
		this.setState({ [stateKey]: value })
	}

	componentDidMount() {
		const { dispatch, bible, auth } = this.props

		this.recentVersions = new RecentVersions()

		this.recentVersions.onUpdate((settings) => {
			dispatch(ActionCreators.usersUpdateSettings(auth.isLoggedIn, settings))
		})

		this.recentVersions.syncVersions(bible.settings)
	}


	render() {
		const { bible, settings, verseAction, hosts } = this.props
		const { results, versions, fontSize, fontFamily, showFootnotes, showVerseNumbers, verseSelection } = this.state

		if (Array.isArray(bible.books.all) && bible.books.map && bible.chapter && Array.isArray(bible.languages.all) && bible.languages.map && bible.version.abbreviation ) {
			this.header = (
				<Header sticky={true} >
					<ChapterPicker
						{...this.props}
						chapter={bible.chapter}
						books={bible.books.all}
						bookMap={bible.books.map}
						selectedLanguage={this.state.selectedLanguage}
						getChapter={::this.getChapter}
						initialBook={this.state.selectedBook}
						initialChapter={this.state.selectedChapter}
						initialInput={this.inputValue}
						initialChapters={this.chapters}
						cancelDropDown={this.state.chapDropDownCancel}
						ref={(cpicker) => { this.chapterPickerInstance = cpicker }}
					/>
					<VersionPicker
						{...this.props}
						version={bible.version}
						languages={bible.languages.all}
						versions={bible.versions}
						languageMap={bible.languages.map}
						selectedChapter={bible.chapter.reference ? bible.chapter.reference.usfm : this.state.selectedChapter}
						alert={this.state.chapterError}
						getVersion={::this.getVersion}
						getVersions={::this.getVersions}
						cancelDropDown={this.state.versionDropDownCancel}
						ref={(vpicker) => { this.versionPickerInstance = vpicker }}
					/>
					<AudioPopup audio={bible.audio} hosts={hosts} />
					<Settings
						onChange={this.handleSettingsChange}
						initialFontSize={fontSize}
						initialFontFamily={fontFamily}
						initialShowFootnotes={showFootnotes}
						initialShowVerseNumbers={showVerseNumbers}
					/>
				</Header>
			)
		}

		if (this.state.chapterError) {
			this.content = (
				<div className='row reader-center reader-content-error'>
					<div className='content'>
						<FormattedMessage id="Reader.chapterpicker.chapter unavailable" />
					</div>
					<div className='row buttons'>
						<div className='solid-button' onClick={this.chapterPickerInstance.handleDropDownClick}>
							<FormattedMessage id="chapter" />
						</div>
						<div className='solid-button' onClick={this.versionPickerInstance.handleDropDownClick}>
							<FormattedMessage id="EventEdit.features.content.components.ContentTypeReference.version" />
						</div>
					</div>
				</div>
			)
		} else if (bible.chapter && bible.chapter.reference && bible.version && bible.version.language && bible.chapter.content) {
			this.content = (
				<div>
					<Chapter
						{...this.props}
						chapter={bible.chapter}
						verseColors={bible.verseColors}
						fontSize={fontSize}
						fontFamily={fontFamily}
						onSelect={this.handleVerseSelect}
						textDirection={bible.version.language.text_direction}
						showFootnotes={showFootnotes}
						showVerseNumbers={showVerseNumbers}
						ref={(chapter) => { this.chapter = chapter }}
					/>
					<ReaderArrows
						previousChapter={bible.chapter.previous ? bible.chapter.previous.usfm : null}
						nextChapter={bible.chapter.next ? bible.chapter.next.usfm : null}
						onClick={::this.getChapter}
					/>
				</div>
			)
		}

		return (
			<div className="">
				{ this.header }
				<div className="row">
					<div className="columns large-6 medium-10 medium-centered">
						{ this.content }
					</div>
				</div>
				<VerseAction
					{...this.props}
					verseAction={verseAction}
					selection={verseSelection}
					colors={bible.highlightColors}
					onClose={this.handleVerseSelectionClear}
				/>
			</div>
		)
	}
}

Bible.propTypes = {
	bible: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired
}

export default injectIntl(Bible)