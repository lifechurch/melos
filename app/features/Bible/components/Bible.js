import React, { Component, PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import Immutable from 'immutable'
import Helmet from 'react-helmet'
import VerseAction from './verseAction/VerseAction'
import ActionCreators from '../actions/creators'
import Filter from '../../../lib/filter'
import Chapter from './content/Chapter'
import NavArrows from './content/NavArrows'
import ChapterPicker from './chapterPicker/ChapterPicker'
import VersionPicker from './versionPicker/VersionPicker'
import LocalStore from '../../../lib/localStore'
import ViewportUtils from '../../../lib/viewportUtils'
import RecentVersions from '../lib/RecentVersions'
import Header from './header/Header'
import Settings from './settings/Settings'
import AudioPopup from './audio/AudioPopup'
import ChapterCopyright from './content/ChapterCopyright'


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

		// if (bible.chapter && bible.chapter.reference && bible.chapter.reference.usfm) {
		// 	this.selectedBook = bible.chapter.reference.usfm.split('.')[0]
		// 	this.selectedChapter = bible.chapter.reference.usfm
		// 	this.selectedVersion = bible.chapter.reference.version_id
		// 	this.inputValue = bible.chapter.reference.human
		// 	this.chapters = bible.books.all[bible.books.map[bible.chapter.reference.usfm.split('.')[0]]].chapters
		// }

		const showFootnoes = LocalStore.getIn('reader.settings.showFootnotes')
		const showVerseNumbers = LocalStore.getIn('reader.settings.showVerseNumbers')

		this.state = {
			selectedBook: bible.chapter.reference.usfm.split('.')[0],
			selectedChapter: bible.chapter.reference.usfm,
			selectedVersion: bible.chapter.reference.version_id,
			selectedLanguage: bible.versions.selectedLanguage,
			chapterError: bible.chapter.showError,
			recentVersions: {},
			dbReady: false,
			chapDropDownCancel: false,
			versionDropDownCancel: false,
			db: null,
			results: [],
			versions: [],
			extraStyle: '',
			fontSize: LocalStore.getIn('reader.settings.fontSize') || DEFAULT_READER_SETTINGS.fontSize,
			fontFamily: LocalStore.getIn('reader.settings.fontFamily') || DEFAULT_READER_SETTINGS.fontFamily,
			showFootnotes: typeof showFootnoes === 'boolean' ? showFootnoes : DEFAULT_READER_SETTINGS.showFootnotes,
			showVerseNumbers: typeof showVerseNumbers === 'boolean' ? showVerseNumbers : DEFAULT_READER_SETTINGS.showVerseNumbers,
			verseSelection: {},
			deletableColors: []
		}
		this.chapters = bible.books.all[bible.books.map[this.state.selectedBook]].chapters

		this.header = null
		this.content = null
		this.extraStyle = null
		this.chapterPicker = null
		this.versionPicker = null
	}

	componentDidMount() {
		const { dispatch, bible, auth } = this.props
		const { chapterError } = this.state

		// check for cookie written from reading plans telling
		// bible to open with the chapterpicker modal open
		if (LocalStore.get('showPickerOnLoad') || chapterError || bible.chapter.showError) {
			this.chapterPickerInstance.openDropdown()
			LocalStore.delete('showPickerOnLoad')
		}

		this.recentVersions = new RecentVersions()
		this.recentVersions.syncVersions(bible.settings)
		this.updateRecentVersions()
		this.recentVersions.onUpdate((settings) => {
			dispatch(ActionCreators.usersUpdateSettings(auth.isLoggedIn, settings))
		})
		if (!chapterError && !bible.chapter.showError) {
			this.viewportUtils = new ViewportUtils()
			this.updateMobileStyling()
			this.viewportUtils.registerListener('resize', this.updateMobileStyling)
		}
	}

	componentDidUpdate(prevProps) {
		const { bible } = this.props

		// send error down to pickers
		if (bible.chapter && prevProps.bible.chapter && bible.chapter.reference.usfm !== prevProps.bible.chapter.reference.usfm) {
			if (bible.chapter.errors) {
				this.setState({ chapterError: true })
			} else if (bible.chapter.reference && bible.chapter.reference.usfm) {
				this.setState({
					chapterError: false,
					selectedChapter: bible.chapter.reference.usfm,
					selectedVersion: bible.chapter.reference.version_id,
				})

				LocalStore.set('last_read', bible.chapter.reference.usfm)
				this.handleVerseSelectionClear()
			}
		}

		// update version for the chapter picker if a new version has been selected
		if (bible.version && bible.version.id && bible.books && bible.books.all && prevProps.bible.version && prevProps.bible.version.id && bible.version.id !== prevProps.bible.version.id) {
			this.recentVersions.addVersion(bible.version)

			this.setState({
				selectedVersion: bible.version.id,
			})
			this.updateRecentVersions()
			Filter.clear('BooksStore')
			Filter.add('BooksStore', bible.books.all)
			LocalStore.set('version', bible.version.id)
		}

	}

	getVersions = (languageTag) => {
		const { dispatch } = this.props
		this.setState({ selectedLanguage: languageTag })
		dispatch(ActionCreators.bibleVersions({ language_tag: languageTag, type: 'all' })).then((versions) => {
			Filter.clear('VersionStore')
			Filter.add('VersionStore', versions.versions)
		})
	}

// TODO: use readerUtils for this
	handleVerseSelect = (verseSelection) => {
		const { hosts, bible: { version: { id, local_abbreviation }, chapter: { reference: { human, usfm } }, verseColors }, dispatch } = this.props
		const refUrl = `${hosts.railsHost}/${id}/${usfm}.${verseSelection.human}`

		// get the verses that are both selected and already have a highlight
		// color associated with them, so we can allow the user to delete them
		const deletableColors = []
		verseSelection.verses.forEach((selectedVerse) => {
			verseColors.forEach((colorVerse) => {
				if (selectedVerse === colorVerse[0]) {
					deletableColors.push(colorVerse[1])
				}
			})
		})
		this.setState({
			deletableColors,
			verseSelection: Immutable.fromJS(verseSelection).merge({
				chapter: human,
				url: refUrl,
				version: id
			}).toJS()
		})

		// now merge in the text for the verses for actions like copy and share
		// we're setting state with all the other verseAction before so this api call doesn't slow anything down
		if (verseSelection.verses && verseSelection.verses.length > 0) {
			dispatch(ActionCreators.bibleVerses({
				id,
				references: verseSelection.verses,
				format: 'text',
				local_abbreviation
			})).then((response) => {
				this.setState({
					verseSelection: Immutable.fromJS(this.state.verseSelection).merge({
						text: response.verses.reduce((acc, curr, index) => {
							// don't put a space in front of the first string
							if (index !== 0) {
								return `${acc} ${curr.content}`
							} else {
								return acc + curr.content
							}
						}, '')
					}).toJS()
				})
			})
		}
	}

	handleVerseSelectionClear = () => {
		if (typeof this.chapter !== 'undefined' && this.chapter) {
			this.chapter.clearSelection()
		}
		this.setState({ verseSelection: {}, deletableColors: [] })
	}

	updateRecentVersions = () => {
		const { bible } = this.props
		const versionList = Object.keys(bible.versions.byLang).reduce((acc, curr) => {
			return Object.assign(acc, bible.versions.byLang[curr].versions)
		}, {})

		this.setState({
			recentVersions: this.recentVersions.getVersions(versionList),
		})
	}

	handleSettingsChange = (key, value) => {
		LocalStore.setIn(key, value)
		const stateKey = key.split('.').pop()
		this.setState({ [stateKey]: value })
	}

	/**
	 * this function is called on component mount, every screen resize
	 *
	 * figures out the viewport size and styles the modals to fill the screen
	 * if the user is on a mobile (small: <= 599 px) screen
	 *
	 */
	updateMobileStyling = () => {
		if (typeof window === 'undefined') {
			return
		}

		const viewport = this.viewportUtils.getViewport()
		// if we're actually going to use this style, let's do the calculations and set it
		// i.e. we're on a mobile screen
		if (parseInt(viewport.width, 10) <= 599) {

			// the modal is the absolute positioned element that shows the dropdowns
			const modalPos = this.viewportUtils.getElement(document.getElementsByClassName('modal')[0])
			// the header on mobile becomes fixed at the bottom, so we need the mobile to fill until that
			const footerModal = this.viewportUtils.getElement(document.getElementById('fixed-page-header'))

			// how much offset is there from modalPos.top and bookList.top?
			// we need to bring that into the calculations so we don't set the height too high for the viewport
			const bookList = document.getElementsByClassName('book-list')[0]
			const bookContainer = document.getElementsByClassName('book-container')[0]
			const bookOffset = Math.abs(this.viewportUtils.getElement(bookContainer).top - this.viewportUtils.getElement(bookList).top)

			const versionList = document.getElementsByClassName('version-list')[0]
			const versionContainer = document.getElementsByClassName('version-container')[0]
			const versionOffset = Math.abs(this.viewportUtils.getElement(versionContainer).top - this.viewportUtils.getElement(versionList).top)

			this.setState({
				extraStyle: `
					@media only screen and (max-width: 37.438em) {
						.book-list, .chapter-list {
							max-height: ${viewport.height - (modalPos.top + bookOffset + footerModal.height)}px !important;
						}
						.book-container, .language-container, .version-container {
							width: ${viewport.width}px !important;
						}
						.language-list {
							max-height: ${viewport.height - (modalPos.top + bookOffset + 40 + footerModal.height)}px !important;
						}
						.version-list {
							max-height: ${viewport.height - (modalPos.top + versionOffset + footerModal.height)}px !important;
						}
					}
				`
			})

		}

	}

	render() {
		const { bible, hosts, params, intl, isRtl } = this.props
		const { fontSize, fontFamily, showFootnotes, showVerseNumbers, verseSelection } = this.state

		let metaTitle = `${intl.formatMessage({ id: 'Reader.meta.mobile.title' })} | ${intl.formatMessage({ id: 'Reader.meta.site.title' })}`
		let metaContent = ''

		if (Array.isArray(bible.books.all) && bible.books.map && bible.chapter && Array.isArray(bible.languages.all) && bible.languages.map && bible.version.abbreviation) {
			this.header = (
				<Header sticky={true} classes={'reader-header horizontal-center'}>
					<ChapterPicker
						{...this.props}
						chapter={bible.chapter}
						books={bible.books.all}
						bookMap={bible.books.map}
						selectedLanguage={this.state.selectedLanguage}
						initialBook={this.state.selectedBook}
						initialChapter={this.state.selectedChapter}
						versionID={this.state.selectedVersion}
						initialInput={bible.chapter.reference.human}
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
						getVersions={this.getVersions}
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

		if (this.state.chapterError || bible.chapter.showError) {
			this.content = (
				<div className='row reader-center reader-content-error'>
					<div className='content'>
						<FormattedMessage id="Reader.chapterpicker.chapter unavailable" />
					</div>
					{/* <div className='row buttons'>
						<button className='chapter-button solid-button' onClick={this.chapterPickerInstance ? this.chapterPickerInstance.handleDropDownClick : () => {}}>
							<FormattedMessage id="Reader.chapterpicker.chapter label" />
						</button>
						<button className='chapter-button solid-button' onClick={this.versionPickerInstance ? this.versionPickerInstance.handleDropDownClick : () => {}}>
							<FormattedMessage id="Reader.versionpicker.version label" />
						</button>
					</div> */}
				</div>
			)
		} else if (bible.chapter && bible.chapter.reference && bible.chapter.reference.usfm && bible.version && bible.version.language && bible.chapter.content) {
			this.content = (
				<div>
					<Chapter
						{...this.props}
						content={bible.chapter.content}
						verseColors={bible.verseColors}
						fontSize={fontSize}
						fontFamily={fontFamily}
						onSelect={this.handleVerseSelect}
						textDirection={bible.version.language.text_direction}
						showFootnotes={showFootnotes}
						showVerseNumbers={showVerseNumbers}
						ref={(chapter) => { this.chapter = chapter }}
					/>
					<ChapterCopyright
						copyright={bible.chapter.copyright}
						versionId={bible.chapter.reference.version_id}
					/>
					<NavArrows
						{...this.props}
						isRtl={isRtl()}
						previousURL={bible.chapter.previous ? `/bible/${this.state.selectedVersion}/${bible.chapter.previous.usfm}.${params.vabbr}` : null}
						nextURL={bible.chapter.next ? `/bible/${this.state.selectedVersion}/${bible.chapter.next.usfm}.${params.vabbr}` : null}
					/>
				</div>
			)

			// overwrite meta with bible stuff
			metaTitle = `${bible.chapter.reference.human}, ${bible.version.local_title} (${bible.version.local_abbreviation.toUpperCase()}) | ${intl.formatMessage({ id: 'Reader.chapter' })} ${bible.chapter.reference.usfm.split('.').pop()} | ${intl.formatMessage({ id: 'Reader.meta.mobile.title' })} | ${intl.formatMessage({ id: 'Reader.meta.site.title' })}`
			const strippedChapterText = bible.chapter.content.replace(/(<([^>]+)>[0-9]{0,3})/ig, '').trim()
			metaContent = `${bible.chapter.reference.human}, ${bible.version.local_title} (${bible.version.local_abbreviation.toUpperCase()}) ${strippedChapterText.substring(0, 170)}`
		}

		return (
			<div>
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
					selection={verseSelection}
					onClose={this.handleVerseSelectionClear}
					deletableColors={this.state.deletableColors}
					version={bible.version}
					verseColors={bible.verseColors}
					verses={bible.verses.verses}
					references={bible.verses.references}
					highlightColors={bible.highlightColors}
					momentsLabels={bible.momentsLabels}
				/>
				<style>
					{ this.state.extraStyle }
				</style>
			</div>
		)
	}
}

Bible.propTypes = {
	bible: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
	intl: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	isRtl: PropTypes.oneOfType([ PropTypes.func, PropTypes.bool ]).isRequired,
	auth: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired
}

Bible.defaultProps = {

}

export default injectIntl(Bible)
