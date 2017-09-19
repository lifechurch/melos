import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import rtlDetect from 'rtl-detect'
import { routeActions } from 'react-router-redux'
import Immutable from 'immutable'

// actions
import bibleAction from '@youversion/api-redux/lib/endpoints/bible/action'
import audioAction from '@youversion/api-redux/lib/endpoints/audio/action'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import bibleReference from '@youversion/api-redux/lib/batchedActions/bibleReference'
// models
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import getAudioModel from '@youversion/api-redux/lib/models/audio'
// components
import Header from '../features/Bible/components/header/Header'
import VersionPicker from '../features/Bible/components/versionPicker/VersionPicker'
import AudioPopup from '../features/Bible/components/audio/AudioPopup'
// utils
import {
	getBibleVersionFromStorage,
	chapterifyUsfm,
	buildCopyright,
	isVerseOrChapter,
	parseVerseFromContent,
	getVerseAudioTiming,
} from '../lib/readerUtils'
import { getReferencesTitle } from '../lib/usfmUtils'
import ViewportUtils from '../lib/viewportUtils'
import Routes from '../lib/routes'
import Filter from '../lib/filter'
import LocalStore from '../lib/localStore'
import RecentVersions from '../features/Bible/lib/RecentVersions'


class BibleHeader extends Component {
	constructor(props) {
		super(props)
		this.state = {
			usfm: props.usfm,
			version_id: props.version_id || getBibleVersionFromStorage(),
			language_tag: props.language_tag
				|| (typeof window !== 'undefined' && window.__LOCALE__ && window.__LOCALE__.locale3),
			audioPlaying: false,
			mobileStyle: '',
		}
		this.viewportUtils = new ViewportUtils()
	}

	componentDidMount() {
		const { usfm, version_id, language_tag } = this.state
		this.getBibleData(usfm, version_id)
		this.getVersions(language_tag)

		this.recentVersions = new RecentVersions()
		this.updateRecentVersions()
		// this.recentVersions.syncVersions(bible.settings)
		// this.recentVersions.onUpdate((settings) => {
		// 	dispatch(ActionCreators.usersUpdateSettings(auth.isLoggedIn, settings))
		// })
		this.viewportUtils.registerListener('resize', this.updateMobileStyling)
	}

	componentWillReceiveProps(nextProps) {
		const { usfm, version_id } = this.state
		// if we're updating the usfm from props then let's get it
		if (usfm && nextProps.usfm && this.props.usfm !== nextProps.usfm && usfm !== nextProps.usfm) {
			this.getBibleData(nextProps.usfm, version_id)
		}
		// if we're updating the version from props then let's get it
		if (version_id && nextProps.version_id && this.props.version_id !== nextProps.version_id && version_id !== nextProps.version_id) {
			this.getBibleData(usfm, nextProps.version_id)
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { dispatch, bible } = this.props
		const { version_id } = this.state

		if (version_id !== prevState.version_id) {
			dispatch(bibleAction({
				method: 'version',
				params: {
					id: version_id
				}
			})).then((response) => {
				this.updateRecentVersions(response)
			})
		}

		if (bible.versions !== prevProps.bible.versions && this.versionPickerInstance) {
			this.updateMobileStyling()
		}
	}

	getReference = (usfm, version_id = null) => {
		const { bible, dispatch } = this.props
		if (usfm) {
			this.setState({ usfm, version_id })
			// if we don't already have it in app state,
			// let's get it
			if (!(bible && bible.pullRef(usfm, version_id))) {
				dispatch(bibleReference(usfm, version_id))
			}
		}
	}

	getVersions = (language_tag) => {
		const { dispatch } = this.props
		if (language_tag && typeof language_tag === 'string') {
			this.setState({ language_tag })
			dispatch(bibleAction({
				method: 'versions',
				params: {
					language_tag,
					type: 'all'
				}
			})).then((versions) => {
				Filter.clear('VersionStore')
				Filter.add('VersionStore', versions.versions)
			})
		}
	}

	getBibleData = (usfm, version_id) => {
		const { bible, moments, dispatch, audio } = this.props

		this.getReference(usfm, version_id)

		if (!(bible && Immutable.fromJS(bible).hasIn(['languages', 'all']))) {
			dispatch(bibleAction({
				method: 'configuration',
				params: {
					type: 'all',
				}
			}))
		}
		if (version_id && !(bible && Immutable.fromJS(bible).hasIn(['versions', 'byId', version_id]))) {
			dispatch(bibleAction({
				method: 'version',
				params: {
					id: version_id,
				}
			}))
		}
		if (version_id && usfm && !(audio && Immutable.fromJS(audio).hasIn(['chapter', chapterifyUsfm(usfm), version_id]))) {
			dispatch(audioAction({
				method: 'chapter',
				params: {
					reference: chapterifyUsfm(usfm),
					version_id
				},
			}))
		}
	}

	updateRecentVersions = (newVersion) => {
		const { bible } = this.props

		if (newVersion) {
			this.recentVersions.addVersion(newVersion)
			Filter.clear('BooksStore')
			Filter.add('BooksStore', newVersion.books)
			LocalStore.set('version', newVersion.id)
		}
		const versionList = Object.keys(bible.versions.byLang).reduce((acc, curr) => {
			return Object.assign(acc, bible.versions.byLang[curr].versions)
		}, {})
		this.setState({
			recentVersions: this.recentVersions.getVersions(versionList),
		})
	}

	/**
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
			const modalPos = this.viewportUtils && this.viewportUtils.getElement(document.getElementsByClassName('modal')[0])
			// the header on mobile becomes fixed at the bottom, so we need the mobile to fill until that
			const headerModal = this.viewportUtils && this.viewportUtils.getElement(document.getElementById('react-app-Header'))

			// how much offset is there from modalPos.top and bookList.top?
			// we need to bring that into the calculations so we don't set the height too high for the viewport
			const bookList = document.getElementsByClassName('book-list')[0]
			const bookContainer = document.getElementsByClassName('book-container')[0]
			let bookOffset = 0
			if (bookList && bookContainer && this.viewportUtils) {
				bookOffset = Math.abs(this.viewportUtils.getElement(bookContainer).top - this.viewportUtils.getElement(bookList).top)
			}

			const versionList = document.getElementsByClassName('version-list')[0]
			const versionContainer = document.getElementsByClassName('version-container')[0]
			let versionOffset = 0
			if (versionList && versionContainer && this.viewportUtils) {
				versionOffset = Math.abs(this.viewportUtils.getElement(versionContainer).top - this.viewportUtils.getElement(versionList).top)
			}

			this.setState({
				mobileStyle: `
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
			customHeaderClass,
			bible,
			audio,
			hosts,
			sticky,
			showChapterPicker,
			showVersionPicker,
			showAudio,
			showSettings,
			showParallel,
			onVersionClick,
			localizedLink,
			dispatch,
		} = this.props
		const { usfm, version_id, audioPlaying, recentVersions, mobileStyle } = this.state

		const hasAudio = audio && Immutable.fromJS(audio).hasIn(['chapter', chapterifyUsfm(usfm), `${version_id}`])
		const isChapter = usfm && isVerseOrChapter(usfm).isChapter
		let currentAudio = null
		let timing
		if (hasAudio) {
			currentAudio = audio.pullRef(chapterifyUsfm(usfm), version_id)
			if (!isChapter) {
				const split = usfm.split('+')
				const startRef = split[0]
				const endRef = split.pop()
				timing = getVerseAudioTiming(startRef, endRef, currentAudio.timing)
			}
		}

		this.ref = bible && bible.pullRef(usfm, version_id)
			? bible.pullRef(usfm, version_id)
			: null
		this.version = bible && Immutable.fromJS(bible).hasIn(['versions', 'byId', `${version_id}`, 'response'])
			? Immutable.fromJS(bible).getIn(['versions', 'byId', `${version_id}`, 'response']).toJS()
			: null

		return (
			<Header
				sticky={sticky}
				classes={customHeaderClass}
			>
				{
					!showChapterPicker
						&& this.version
						&& this.version.books
						&& (
							<div className='ref-heading'>
								{
									getReferencesTitle({
										bookList: this.version.books,
										usfmList: usfm.split('+')
									}).title
								}
							</div>
						)
				}
				{/* {
					showChapterPicker &&
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
						onRefSelect={onRefSelect}
						ref={(cpicker) => { this.chapterPickerInstance = cpicker }}
						linkBuilder={(version, usfm, abbr) => {
							return `${buildBibleLink(version, usfm, abbr)}${hasParallel ? `?parallel=${bible.parallelVersion.id}` : ''}`
						}}
					/>
				} */}
				{
					showVersionPicker &&
						<VersionPicker
							extraClassNames='main-version-picker-container'
							version={this.version}
							languages={bible.languages.all}
							versions={bible.versions}
							recentVersions={recentVersions}
							languageMap={bible.languages.map}
							selectedChapter={usfm}
							// alert={this.state.chapterError}
							getVersions={this.getVersions}
							onClick={
								onVersionClick
									? ({ id }) => {
										onVersionClick(id)
									}
									: null
							}
							// cancelDropDown={this.state.versionDropDownCancel}
							ref={(v) => { this.versionPickerInstance = v }}
							localizedLink={localizedLink}
							dispatch={dispatch}
						/>
				}
				{/* {
					!hasParallel &&
						<Link
							to={buildBibleLink(this.state.selectedVersion, bible.chapter.reference.usfm, bible.version.local_abbreviation)}
							query={{ parallel: LocalStore.get('parallelVersion') || bible.version.id }}
							className='hide-for-small'
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: 8,
								lineHeight: 1
							}}
						>
							<PlusButton
								className='circle-border'
								height={13}
								width={13}
							/>
							<span
								style={{
									fontSize: 12,
									color: '#979797',
									paddingLeft: 5,
									paddingTop: 2
								}}
							>
								<FormattedMessage id='Reader.header.parallel' />
							</span>
						</Link>
				}
				{
					hasParallel &&
						<VersionPicker
							{...this.props}
							version={bible.parallelVersion}
							languages={bible.languages.all}
							versions={bible.versions}
							recentVersions={this.state.recentVersions}
							languageMap={bible.languages.map}
							selectedChapter={this.state.selectedChapter}
							alert={this.state.chapterError}
							getVersions={this.getVersions}
							cancelDropDown={this.state.parallelDropDownCancel}
							extraClassNames='hide-for-small parallel-version-picker-container'
							ref={(vpicker) => { this.parallelVersionPickerInstance = vpicker }}
							linkBuilder={(version, usfm, abbr) => {
								return `${buildBibleLink(bible.version.id, usfm, abbr)}?parallel=${version}`
							}}
						/>
				} */}
				{
					showAudio &&
						<AudioPopup
							audio={currentAudio}
							enabled={hasAudio}
							// onAudioComplete={onAudioComplete}
							startTime={!isChapter && hasAudio ? timing.startTime : 0}
							stopTime={!isChapter && hasAudio ? timing.endTime : null}
							playing={audioPlaying}
							hosts={hosts}
						/>
				}
				{/* {
					showSettings &&
					<Settings
						onChange={this.handleSettingsChange}
						initialFontSize={fontSize}
						initialFontFamily={fontFamily}
						initialShowFootnotes={showFootnotes}
						initialShowVerseNumbers={showVerseNumbers}
					/>
				}
				{
					hasParallel &&
						<Link
							to={buildBibleLink(this.state.selectedVersion, bible.chapter.reference.usfm, bible.version.local_abbreviation)}
							className='hide-for-small'
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								marginLeft: 15,
								lineHeight: 1
							}}
						>
							<XMark
								className='circle-border'
								height={13}
								width={13}
							/>
							<span
								style={{
									fontSize: 12,
									color: '#979797',
									paddingLeft: 5,
									paddingTop: 2
								}}
							>
								<FormattedMessage id='Reader.header.parallel exit' />
							</span>
						</Link>
				} */}
				<style>
					{ mobileStyle }
				</style>
			</Header>
		)
	}
}

BibleHeader.propTypes = {

}

BibleHeader.defaultProps = {

}

function mapStateToProps(state) {
	return {
		bible: getBibleModel(state),
		audio: getAudioModel(state),
		auth: state.auth,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(BibleHeader)
