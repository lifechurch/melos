import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Immutable from 'immutable'

import LocalStore from '@youversion/utils/lib/localStore'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'
import isVerseOrChapter from '@youversion/utils/lib/bible/isVerseOrChapter'
import getVerseAudioTiming from '@youversion/utils/lib/bible/getVerseAudioTiming'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
// actions
import bibleAction from '@youversion/api-redux/lib/endpoints/bible/action'
import audioAction from '@youversion/api-redux/lib/endpoints/audio/action'
import bibleReference from '@youversion/api-redux/lib/batchedActions/bibleReference'
// models
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getAudioModel from '@youversion/api-redux/lib/models/audio'
// components
import Header from '../features/Bible/components/header/Header'
import VersionPicker from '../features/Bible/components/versionPicker/VersionPicker'
import AudioPopup from '../features/Bible/components/audio/AudioPopup'
// utils
import ViewportUtils from '../lib/viewportUtils'
import Filter from '../lib/filter'
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
		const { usfm, version_id } = this.state
		this.getBibleData(usfm, version_id)
		this.recentVersions = new RecentVersions()
		this.updateRecentVersions()
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

	getBibleData = (usfm, version_id) => {
		const { dispatch, audio } = this.props
		this.getReference(usfm, version_id)
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
			onVersionClick,
			dispatch,
			onAudioComplete,
			audioPlaying
		} = this.props

		const {
			usfm,
			version_id,
			recentVersions,
			mobileStyle
		} = this.state

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
				{
					showVersionPicker &&
					<VersionPicker
						extraClassNames='main-version-picker-container'
						version_id={this.version && this.version.id}
						recentVersions={recentVersions}
						selectedChapter={usfm}
						// getVersions={this.getVersions}
						onClick={
								onVersionClick
									? ({ id }) => {
										onVersionClick(id)
									}
									: null
						}
						ref={(v) => { this.versionPickerInstance = v }}
						dispatch={dispatch}
					/>
				}
				{
					showAudio &&
					<AudioPopup
						audio={currentAudio}
						enabled={hasAudio}
						onAudioComplete={onAudioComplete}
						startTime={!isChapter && hasAudio ? timing.startTime : 0}
						stopTime={!isChapter && hasAudio ? timing.endTime : null}
						playing={audioPlaying}
						hosts={hosts}
					/>
				}
				<style>
					{ mobileStyle }
				</style>
			</Header>
		)
	}
}

BibleHeader.propTypes = {
	usfm: PropTypes.string.isRequired,
	version_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	bible: PropTypes.object.isRequired,
	audio: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
	sticky: PropTypes.bool,
	showAudio: PropTypes.bool,
	showChapterPicker: PropTypes.bool,
	showVersionPicker: PropTypes.bool,
	customHeaderClass: PropTypes.string,
	language_tag: PropTypes.string,
	onVersionClick: PropTypes.func,
	dispatch: PropTypes.func.isRequired,
	onAudioComplete: PropTypes.func,
	audioPlaying: PropTypes.bool
}

BibleHeader.defaultProps = {
	showCopyright: true,
	showGetChapter: true,
	showAudio: true,
	showVerseAction: true,
	showChapterPicker: true,
	showVersionPicker: true,
	sticky: true,
	version_id: null,
	customHeaderClass: null,
	language_tag: null,
	onVersionClick: null,
	onAudioComplete: () => {},
	audioPlaying: false
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
