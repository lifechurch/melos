import React, { Component, PropTypes } from 'react'
import VerseAction from './verseAction/VerseAction'
// import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import ActionCreators from '../actions/creators'
import Filter from '../../../lib/filter'
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
// import cookie from 'react-cookie';
import Chapter from './content/Chapter'
import ReaderArrows from './content/ReaderArrows'
import ChapterPicker from './chapterPicker/ChapterPicker'
import VersionPicker from './versionPicker/VersionPicker'
// import LabelList from './verseAction/bookmark/LabelList'
import LocalStore from '../../../lib/localStore'
import RecentVersions from '../lib/RecentVersions'
// import LabelSelector from './verseAction/bookmark/LabelSelector'
import Header from './header/Header'
import Settings from './settings/Settings'
import AudioPopup from './audio/AudioPopup'
// import DropdownTransition from '../../../components/DropdownTransition'
import Immutable from 'immutable'
import Helmet from 'react-helmet'


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
			recentVersions: {},
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
		if (typeof this.chapter !== 'undefined' && this.chapter) {
			this.chapter.clearSelection()
		}
		this.setState({ verseSelection: {} })
	}


	componentDidUpdate(prevProps, prevState) {
		const { bible } = this.props

		// send error down to pickers
		if (bible.chapter && prevProps.bible.chapter && bible.chapter.reference.usfm !== prevProps.bible.chapter.reference.usfm) {
			if (bible.chapter.errors) {
				this.setState({ chapterError: true })
			} else {
				if (bible.chapter.reference && bible.chapter.reference.usfm) {
					this.setState({
						chapterError: false,
						selectedChapter: bible.chapter.reference.usfm,
						selectedVersion: bible.chapter.reference.version_id,
					})

					LocalStore.set('last_read', bible.chapter.reference.usfm)
					this.handleVerseSelectionClear()
				}
			}
		}

		// update version for the chapter picker if a new version has been selected
		if (bible.version && bible.version.id && bible.books && bible.books.all && prevProps.bible.version && prevProps.bible.version.id && bible.version.id !== prevProps.bible.version.id) {
			this.recentVersions.addVersion(bible.version)

			this.setState({
				selectedVersion: bible.version.id,
			})
			this.updateRecentVersions()
			Filter.clear("BooksStore")
			Filter.add("BooksStore", bible.books.all)
			LocalStore.set('version', bible.version.id)
		}

	}

	updateRecentVersions = () => {
		const { bible } = this.props
		let versionList = Object.keys(bible.versions.byLang).reduce((acc, curr) => {
			return Object.assign(acc, bible.versions.byLang[curr])
		}, {})

		this.setState({
			recentVersions: this.recentVersions.getVersions(versionList),
		})
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
		this.updateRecentVersions()
	}



	render() {
		const { bible, settings, verseAction, hosts, params, intl } = this.props
		const { results, versions, fontSize, fontFamily, showFootnotes, showVerseNumbers, verseSelection } = this.state

		let metaTitle = `${intl.formatMessage({ id: 'Reader.meta.mobile.title' })} | ${intl.formatMessage({ id: 'Reader.meta.site.title' })}`
		let metaContent = ''

		if (Array.isArray(bible.books.all) && bible.books.map && bible.chapter && Array.isArray(bible.languages.all) && bible.languages.map && bible.version.abbreviation ) {
			this.header = (
				<Header sticky={true} >
					<ChapterPicker
						{...this.props}
						chapter={bible.chapter}
						books={bible.books.all}
						bookMap={bible.books.map}
						selectedLanguage={this.state.selectedLanguage}
						initialBook={this.state.selectedBook}
						initialChapter={this.state.selectedChapter}
						versionID={this.state.selectedVersion}
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
						recentVersions={this.state.recentVersions}
						languageMap={bible.languages.map}
						selectedChapter={this.state.selectedChapter}
						alert={this.state.chapterError}
						getVersions={::this.getVersions}
						cancelDropDown={this.state.versionDropDownCancel}
						ref={(vpicker) => { this.versionPickerInstance = vpicker }}
					/>
					<AudioPopup audio={bible.audio} hosts={hosts} enabled={typeof bible.audio.id !== 'undefined'} />
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
						{...this.props}
						previousChapterURL={bible.chapter.previous ? `/bible/${this.state.selectedVersion}/${bible.chapter.previous.usfm}.${params.vabbr}` : null}
						nextChapterURL={bible.chapter.next ? `/bible/${this.state.selectedVersion}/${bible.chapter.next.usfm}.${params.vabbr}` : null}
					/>
				</div>
			)

			// overwrite meta with bible stuff
			metaTitle = `${bible.chapter.reference.human}, ${bible.version.local_title} (${bible.version.local_abbreviation.toUpperCase()}) | ${intl.formatMessage({ id: 'Reader.chapter' })} ${bible.chapter.reference.usfm.split('.').pop()} | ${intl.formatMessage({ id: 'Reader.meta.mobile.title' })} | ${intl.formatMessage({ id: 'Reader.meta.site.title' })}`

			if (bible.verses && bible.verses.verses && Object.keys(bible.verses.verses).length > 0) {
				metaContent = `
					${bible.chapter.reference.human}, ${bible.version.local_title} (${bible.version.local_abbreviation.toUpperCase()})  ${bible.verses.verses[Object.keys(bible.verses.verses)[0]].content.substring(0, 170)}`
			}
		}

		return (
			<div className="">
				<Helmet
					title={metaTitle}
					meta={[
						{ name: 'description', content: `${metaContent.substring(0, 200)}...` },
						{ name: 'og:title', content: metaTitle },
						{ name: 'og:description', content: `${metaContent.substring(0, 200)}...` },
						// hacky meta rendering on rails side
						// { name: 'og:image', content: `` },
						// { name: 'og:url', content: '' },
						// { name: 'twitter:image', content: `` },
						// { name: 'twitter:url', content: `` },
						{ name: 'twitter:title', content: metaTitle },
						{ name: 'twitter:description', content: `${metaContent.substring(0, 200)}...` },
						{ name: 'twitter:site', content: '@YouVersion' },
					]}
				/>
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