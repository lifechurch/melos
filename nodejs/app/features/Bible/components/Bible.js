import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Immutable from 'immutable'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import LocalStore from '@youversion/utils/lib/localStore'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import parseVerseFromContent from '@youversion/utils/lib/bible/parseVerseContent'
import deepLinkPath from '@youversion/utils/lib/bible/deepLinkPath'
import bibleActions from '@youversion/api-redux/lib/endpoints/bible/action'
import VerseAction from './verseAction/VerseAction'
import ActionCreators from '../actions/creators'
import Filter from '../../../lib/filter'
import Chapter from './content/Chapter'
import NavArrows from './content/NavArrows'
import ChapterPicker from './chapterPicker/ChapterPicker'
import VersionPicker from './versionPicker/VersionPicker'
import ViewportUtils from '../../../lib/viewportUtils'
import RecentVersions from '../lib/RecentVersions'
import StickyHeader from '../../../components/StickyHeader'
import Settings from './settings/Settings'
import AudioPopup from './audio/AudioPopup'
import ChapterCopyright from './content/ChapterCopyright'
import ParallelExit from '../../../components/icons/ParallelExit'
import Parallel from '../../../components/icons/Parallel'
import ResponsiveContainer from '../../../components/ResponsiveContainer'
import { buildCopyright, buildMeta } from '../../../lib/readerUtils'

const DEFAULT_READER_SETTINGS = {
	fontFamily: 'Arial',
	fontSize: 18,
	showFootnotes: true,
	showVerseNumbers: true
}

function buildBibleLink(version, usfm, abbr) {
	const finalAbbr = abbr ? abbr.split('-')[0] : ''
	return `/bible/${version}/${usfm}.${finalAbbr}`
}

const ChapterError = (
	<div className='row reader-center reader-content-error'>
		<div className='content'>
			<FormattedMessage id="Reader.chapterpicker.chapter unavailable" />
		</div>
	</div>
)


class Bible extends Component {

	constructor(props) {
		super(props)

		const { bible, hasParallel } = props

		const showFootnoes = LocalStore.getIn('reader.settings.showFootnotes')
		const showVerseNumbers = LocalStore.getIn('reader.settings.showVerseNumbers')

		this.state = {
			selectedBook: bible.chapter.reference.usfm.split('.')[0],
			selectedChapter: bible.chapter.reference.usfm,
			selectedVersion: bible.chapter.reference.version_id,
			selectedLanguage: bible.versions.selectedLanguage,
			parallelSelectedChapter: hasParallel && bible.parallelChapter.reference.usfm,
			parallelSelectedVersion: hasParallel && bible.parallelChapter.reference.version_id,
			chapterError: bible.chapter.showError,
			recentVersions: {},
			dbReady: false,
			chapDropDownCancel: false,
			versionDropDownCancel: false,
			parallelDropDownCancel: false,
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
		this.parallelContent = null
		this.extraStyle = null
		this.chapterPicker = null
		this.versionPicker = null
	}

	componentDidMount() {
		const {
			dispatch,
			bible,
			auth,
			location: {
				query: {
					openPicker
				}
			}
		} = this.props

		const { chapterError } = this.state

		if (openPicker === 'version') {
			this.versionPickerInstance.openDropdown()
		} else if (openPicker === 'parallelVersion' && this.parallelVersionPickerInstance) {
			this.parallelVersionPickerInstance.openDropdown()
		} else if (openPicker === 'chapter' || chapterError || bible.chapter.showError) {
			this.chapterPickerInstance.openDropdown()
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

		if (bible.parallelVersion && bible.parallelVersion.id && bible.books && bible.books.all && prevProps.bible.parallelVersion && prevProps.bible.parallelVersion.id && bible.parallelVersion.id !== prevProps.bible.parallelVersion.id) {
			this.recentVersions.addVersion(bible.parallelVersion)

			this.setState({
				parallelSelectedVersion: bible.parallelVersion.id,
			})
			this.updateRecentVersions()
			LocalStore.set('parallelVersion', bible.parallelVersion.id)
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

	handleVerseSelect = ({ verses }) => {
		const { hosts, bible: { verseColors, chapter, books } } = this.props
		const { selectedVersion } = this.state

		if (verses) {
			const { title, usfm } = getReferencesTitle({
				bookList: books.all,
				usfmList: verses
			})
			const { html, text } = parseVerseFromContent({
				usfms: verses,
				fullContent: chapter ? chapter.content : null
			})
			const refUrl = `${hosts.railsHost}/bible/${selectedVersion}/${usfm}`

			// get the verses that are both selected and already have a highlight
			// color associated with them, so we can allow the user to delete them
			const deletableColors = []
			verses.forEach((selectedVerse) => {
				if (verseColors) {
					verseColors.forEach((colorVerse) => {
						if (selectedVerse === colorVerse[0]) {
							deletableColors.push(colorVerse[1])
						}
					})
				}
			})
			this.setState({
				deletableColors,
				verseSelection: Immutable.fromJS({}).merge({
					human: title,
					url: refUrl,
					text,
					verseContent: html,
					verses,
					version: selectedVersion
				}).toJS()
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

		const viewport = this.viewportUtils && this.viewportUtils.getViewport()
		// if we're actually going to use this style, let's do the calculations and set it
		// i.e. we're on a mobile screen
		if (parseInt(viewport.width, 10) <= 599) {

			// the modal is the absolute positioned element that shows the dropdowns
			const modalPos = this.viewportUtils && this.viewportUtils.getElement(document.getElementsByClassName('modal')[0])
			// the header on mobile becomes fixed at the bottom, so we need the mobile to fill until that
			const headerModal = this.viewportUtils && this.viewportUtils.getElement(document.getElementById('react-app-Header'))

			// how much offset is there from modalPos.top and bookList.top?
			// we need to bring that into the calculations so we don't set the height too high for the viewport
			const bookList = document.getElementsByClassName('book-list')[0]
			const bookContainer = document.getElementsByClassName('book-container')[0]
			const bookOffset = this.viewportUtils && (Math.abs(this.viewportUtils.getElement(bookContainer).top - this.viewportUtils.getElement(bookList).top))

			const versionList = document.getElementsByClassName('version-list')[0]
			const versionContainer = document.getElementsByClassName('version-container')[0]
			const versionOffset = this.viewportUtils && (Math.abs(this.viewportUtils.getElement(versionContainer).top - this.viewportUtils.getElement(versionList).top))

			this.setState({
				extraStyle: `
					@media only screen and (max-width: 37.438em) {
						.book-list, .chapter-list {
							max-height: ${viewport.height - (modalPos.top + bookOffset + headerModal.height)}px !important;
						}
						.book-container, .language-container, .version-container {
							width: ${viewport.width}px !important;
						}
						.language-list {
							max-height: ${viewport.height - (modalPos.top + bookOffset + 40 + headerModal.height)}px !important;
						}
						.version-list {
							max-height: ${viewport.height - (modalPos.top + versionOffset + headerModal.height)}px !important;
						}
					}
				`
			})

		}

	}

	render() {
		const {
			bible,
			hosts,
			intl,
			isRtl,
			hasParallel
		} = this.props

		const {
			fontSize,
			fontFamily,
			showFootnotes,
			showVerseNumbers,
			verseSelection
		} = this.state

		let metaTitle = `${intl.formatMessage({ id: 'Reader.meta.mobile.title' })} | ${intl.formatMessage({ id: 'Reader.meta.site.title' })}`
		let metaContent = ''
		let androidDeepLink = {}
		let iosDeepLink = {}
		let deeplink = {}
		let meta = { link: {}, meta: {} }

		if (
			Array.isArray(bible.books.all)
			&& bible.books.map && bible.chapter
			&& Array.isArray(bible.languages.all)
			&& bible.languages.map
			&& bible.version.abbreviation
		) {
			this.header = (
				<StickyHeader verticalOffset={70} stackOrder={2} translationDistance='70px'>
					<div className='reader-header horizontal-center'>
						<ChapterPicker
							{...this.props}
							chapter={bible.chapter}
							books={bible.books.all}
							bookMap={bible.books.map}
							selectedLanguage={this.state.selectedLanguage}
							initialBook={this.state.selectedBook}
							initialChapter={this.state.selectedChapter}
							versionID={this.state.selectedVersion}
							versionAbbr={bible.version.local_abbreviation}
							initialInput={bible.chapter.reference.human}
							initialChapters={this.chapters}
							cancelDropDown={this.state.chapDropDownCancel}
							ref={(cpicker) => { this.chapterPickerInstance = cpicker }}
							linkBuilder={(version, usfm, abbr) => {
								return `${buildBibleLink(version, usfm, abbr)}${hasParallel ? `?parallel=${bible.parallelVersion.id}` : ''}`
							}}
						/>
						<VersionPicker
							version_id={this.state.selectedVersion}
							recentVersions={this.state.recentVersions}
							selectedChapter={this.state.selectedChapter}
							alert={this.state.chapterError}
							cancelDropDown={this.state.versionDropDownCancel}
							extraClassNames="main-version-picker-container"
							ref={(vpicker) => { this.versionPickerInstance = vpicker }}
							linkBuilder={(version, usfm, abbr) => {
								return `${buildBibleLink(version, usfm, abbr)}${hasParallel ? `?parallel=${bible.parallelVersion.id}` : ''}`
							}}
						/>

						{!hasParallel &&
						<Link
							to={{
								pathname: buildBibleLink(this.state.selectedVersion, bible.chapter.reference.usfm, bible.version.local_abbreviation),
								query: { parallel: LocalStore.get('parallelVersion') || bible.version.id }
							}}
							className="hide-for-small"
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: 8,
								lineHeight: 1
							}}
						>
							<Parallel
								height={16}
								width={16}
							/>
							<span
								style={{
									fontSize: 12,
									color: '#979797',
									paddingLeft: 5,
									paddingTop: 2
								}}
							>
								<FormattedMessage id="Reader.header.parallel" />
							</span>
						</Link>
					}

						{hasParallel &&
						<VersionPicker
							isParallel={true}
							version_id={bible.parallelVersion.id}
							recentVersions={this.state.recentVersions}
							selectedChapter={this.state.selectedChapter}
							alert={this.state.chapterError}
							cancelDropDown={this.state.parallelDropDownCancel}
							extraClassNames="hide-for-small parallel-version-picker-container"
							ref={(vpicker) => { this.parallelVersionPickerInstance = vpicker }}
							linkBuilder={(version, usfm, abbr) => {
								return `${buildBibleLink(bible.version.id, usfm, abbr)}?parallel=${version}`
							}}
						/>
					}

						<AudioPopup audio={bible.audio} hosts={hosts} enabled={typeof bible.audio.id !== 'undefined'} />
						<Settings
							onChange={this.handleSettingsChange}
							initialFontSize={fontSize}
							initialFontFamily={fontFamily}
							initialShowFootnotes={showFootnotes}
							initialShowVerseNumbers={showVerseNumbers}
						/>

						{hasParallel &&
						<Link
							to={buildBibleLink(this.state.selectedVersion, bible.chapter.reference.usfm, bible.version.local_abbreviation)}
							className="hide-for-small"
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginLeft: 15,
								lineHeight: 1
							}}
						>
							<ParallelExit
								height={16}
								width={16}
							/>
							<span
								style={{
									fontSize: 12,
									color: '#979797',
									paddingLeft: 5,
									paddingTop: 2
								}}
							>
								<FormattedMessage id="Reader.header.parallel exit" />
							</span>
						</Link>
					}
					</div>
				</StickyHeader>
			)
		}

		if (this.state.chapterError || bible.chapter.showError) {
			this.content = ChapterError
		} else if (
			bible.chapter
			&& bible.chapter.reference
			&& bible.chapter.reference.usfm
			&& bible.version
			&& bible.version.language
			&& bible.chapter.content
		) {
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
						className="primary-chapter"
     />
					<ChapterCopyright {...buildCopyright(intl.formatMessage, bible.version, bible.chapter.reference)} />
					<ResponsiveContainer>
						<NavArrows
							{...this.props}
							isRtl={isRtl()}
							parallelVersion={hasParallel ? bible.parallelVersion.id : null}
							previousURL={bible.chapter.previous ? buildBibleLink(this.state.selectedVersion, bible.chapter.previous.usfm, bible.version.local_abbreviation) : null}
							nextURL={bible.chapter.next ? buildBibleLink(this.state.selectedVersion, bible.chapter.next.usfm, bible.version.local_abbreviation) : null}
							extraClassNames={hasParallel ? 'parallel' : ''}
						/>
					</ResponsiveContainer>
				</div>
			)

			// overwrite meta with bible stuff
			metaTitle = `${bible.chapter.reference.human}, ${bible.version.local_title} (${bible.version.local_abbreviation.toUpperCase()}) | ${intl.formatMessage({ id: 'Reader.chapter' })} ${bible.chapter.reference.usfm.split('.').pop()} | ${intl.formatMessage({ id: 'Reader.meta.mobile.title' })} | ${intl.formatMessage({ id: 'Reader.meta.site.title' })}`
			const strippedChapterText = bible.chapter.content.replace(/(<([^>]+)>[0-9]{0,3})/ig, '').trim()
			metaContent = `${bible.chapter.reference.human}, ${bible.version.local_title} (${bible.version.local_abbreviation.toUpperCase()}) ${strippedChapterText.substring(0, 170)}`
			const { android, ios } = deepLinkPath(bible.chapter.reference.usfm, bible.version.id, bible.version.local_abbreviation)
			androidDeepLink = android ? { rel: 'alternate', href: `android-app://com.sirma.mobile.bible.android/youversion/${android}` } : null
			iosDeepLink = ios ? { rel: 'alternate', href: `ios-app://282935706/youversion/${ios}` } : null
			deeplink = ios
			meta = buildMeta({ hosts, version: bible.version, usfm: bible.chapter.reference.usfm })
		}

		if (bible.parallelChapter && bible.parallelChapter.errors) {
			this.parallelContent = ChapterError
		} else if (
			hasParallel
			&& bible.parallelChapter
			&& bible.parallelChapter.reference
			&& bible.parallelChapter.reference.usfm
			&& bible.parallelVersion
			&& bible.parallelVersion.language
			&& bible.parallelChapter.content
		) {
			this.parallelContent = (
				<div>
					<Chapter
						{...this.props}
						content={bible.parallelChapter.content}
						// verseColors={bible.verseColors}
						fontSize={fontSize}
						fontFamily={fontFamily}
						// onSelect={this.handleVerseSelect}
						textDirection={bible.parallelVersion.language.text_direction}
						showFootnotes={showFootnotes}
						showVerseNumbers={showVerseNumbers}
						ref={(chapter) => { this.parallelChapter = chapter }}
						className="parallel-chapter"
     />
					<ChapterCopyright {...buildCopyright(intl.formatMessage, bible.parallelVersion, bible.parallelChapter.reference)} />
				</div>
			)
		}

		return (
			<div>
				{
					bible.chapter && bible.chapter.reference && bible.chapter.reference.usfm && bible.version && bible.version.language && bible.chapter.content &&
					<Helmet
						title={metaTitle}
						meta={[
							{ name: 'description', content: `${metaContent.substring(0, 200)}...` },
							{ property: 'og:title', content: metaTitle },
							{ property: 'og:description', content: `${metaContent.substring(0, 200)}...` },
							// hacky meta rendering on rails side
							// { name: 'og:image', content: `` },
							// { name: 'og:url', content: '' },
							// { name: 'twitter:image', content: `` },
							// { name: 'twitter:url', content: `` },
							{ name: 'twitter:title', content: metaTitle },
							{ name: 'twitter:description', content: `${metaContent.substring(0, 200)}...` },
							{ name: 'twitter:site', content: '@YouVersion' },
							androidDeepLink,
							iosDeepLink,
							{ name: 'twitter:app:name:iphone', content: 'Bible' },
							{ name: 'twitter:app:id:iphone', content: '282935706' },
							{ name: 'twitter:app:name:ipad', content: 'Bible' },
							{ name: 'twitter:app:id:ipad', content: '282935706' },
							{ name: 'twitter:app:name:googleplay', content: 'Bible' },
							{ name: 'twitter:app:id:googleplay', content: 'com.sirma.mobile.bible.android' },
							{ name: 'twitter:app:url:iphone', content: `youversion://${deeplink}` },
							{ name: 'twitter:app:url:ipad', content: `youversion://${deeplink}` },
							{ name: 'twitter:app:url:googleplay', content: `youversion://${deeplink}` },
							...meta.meta
						]}
						link={[
							...meta.link
						]}
					/>
				}
				{ this.header }
				{ hasParallel

					? (<div className="row">
						<div className="columns medium-1">&nbsp;</div>
						<div className="columns medium-5">
							{ this.content }
						</div>
						<div className="columns medium-5">
							{ this.parallelContent }
						</div>
						<div className="columns medium-1">&nbsp;</div>
					</div>)

					: (<div className="row">
						<div className="columns large-6 medium-10 medium-centered">
							{ this.content }
						</div>
					</div>)
				}

				<VerseAction
					{...this.props}
					isRtl={isRtl()}
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
	hasParallel: PropTypes.bool
}

Bible.defaultProps = {
	hasParallel: false
}

export default injectIntl(Bible)
