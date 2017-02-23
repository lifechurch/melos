import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import LocalStore from '../../../../lib/localStore'
import BibleActionCreator from '../../../Bible/actions/creators'
import Chapter from '../../../Bible/components/content/Chapter'
import ChapterCopyright from '../../../Bible/components/content/ChapterCopyright'
import AudioPopup from '../../../Bible/components/audio/AudioPopup'
import VerseAction from '../../../Bible/components/verseAction/VerseAction'
import {
	handleVerseSelect,
	handleVerseSelectionClear,
	USER_READER_SETTINGS
} from '../../../../lib/readerUtils'


class PlanRef extends Component {

	constructor(props) {
		super(props)
		this.state = {
			verseSelection: {},
			deletableColors: [],
		}
		this.refToThis = this
	}

	handleGetChapter = () => {
		const { getChapter } = this.props
		if (typeof getChapter === 'function') {
			getChapter()
		}
	}

	/**
	 * this updates this.state.verseSelection and this.state.deletableColors
	 * for the VerseAction component, and also populates app state with the required
	 * data for verseActions
	 */
	handleOnVerseSelect = (verseSelection) => {
		const {
			hosts,
			version: { id, local_abbreviation },
			highlightColors,
			refHeading,
			momentsLabels,
			verseColors,
			dispatch
		} = this.props

		const refUrl = `${hosts.railsHost}/${id}/${verseSelection.verses[0]}`
		// if we don't have highlight colors yet, populate them
		if (!Array.isArray(highlightColors)) {
			dispatch(BibleActionCreator.momentsColors(true))
		}
		// if we don't have labels for bookmarks yet, let's populate them
		if (!Array.isArray(momentsLabels)) {
			dispatch(BibleActionCreator.momentsLabels(true))
		}

		handleVerseSelect(
				this.refToThis,
				verseSelection,
				refUrl,
				id,
				local_abbreviation,
				refHeading,
				verseColors,
				dispatch,
			)

	}

	handleOnVerseClear = () => {
		const refToChapter = this.chapterInstance
		handleVerseSelectionClear(this.refToThis, refToChapter)
	}

	handleChangeReader = () => {
		// this will tell the bible component to render
		// with the chapter picker open, because the user
		// clicked change reference/version
		LocalStore.set('showPickerOnLoad', true)
	}

	render() {
		const {
			verseColors,
			highlightColors,
			momentsLabels,
			content,
			version,
			refHeading,
			bibleChapterLink,
			bibleReferences,
			bibleVerses,
			textDirection,
			showChapterButton,
			audio,
			onAudioComplete,
			audioStart,
			audioStop,
			audioPlaying,
			hosts,
		} = this.props

		// these state variables are set and maintained by the
		// handleOnVerseSelect and handleOnVerseClear
		const {
			verseSelection,
			deletableColors,
		} = this.state

		const planRefHeading = (
			<div className='plan-reader-heading'>
				<div className='ref-heading'>
					{`${refHeading} ${version.local_abbreviation.toUpperCase()}`}
					<a
						href={bibleChapterLink}
						className='pill-heading'
						onClick={this.handleChangeReader}
					>
						<FormattedMessage id='change' />
					</a>
				</div>
				<AudioPopup
					audio={audio}
					hosts={hosts}
					enabled={audio && 'id' in audio}
					onAudioComplete={onAudioComplete}
					// if we're not rendering the entire chapter, the audio should start
					// at the verse start, otherwise, it starts at the beginning of the chapter
					startTime={showChapterButton ? audioStart : 0}
					stopTime={showChapterButton ? audioStop : null}
					playing={audioPlaying}
				/>
			</div>
		)

		let fullChapButton = null
		if (showChapterButton) {
			fullChapButton = (
				<div className='buttons'>
					<button className='chapter-button solid-button' onClick={this.handleGetChapter}>
						<FormattedMessage id='Reader.read chapter' />
					</button>
				</div>
			)
		}

		return (
			<div className='plan-ref'>
				{ planRefHeading }
				<Chapter
					{...this.props}
					content={content}
					verseColors={verseColors}
					fontSize={USER_READER_SETTINGS.fontSize}
					fontFamily={USER_READER_SETTINGS.fontFamily}
					onSelect={this.handleOnVerseSelect}
					showFootnotes={USER_READER_SETTINGS.showFootnotes}
					showVerseNumbers={USER_READER_SETTINGS.showVerseNumbers}
					textDirection={textDirection}
					ref={(chapter) => { this.chapterInstance = chapter }}
				/>
				<ChapterCopyright copyright={version.copyright_short} versionId={version.id} />
				{ fullChapButton }
				<VerseAction
					// props
					{...this.props}
					version={version}
					highlightColors={highlightColors}
					verseColors={verseColors}
					momentsLabels={momentsLabels}
					verses={bibleVerses}
					references={bibleReferences}
					// state
					selection={verseSelection}
					deletableColors={deletableColors}
					onClose={this.handleOnVerseClear}
				/>
			</div>
		)
	}
}

PlanRef.propTypes = {
	getChapter: PropTypes.func,
	audio: PropTypes.object,
	verseColors: PropTypes.array,
	highlightColors: PropTypes.array,
	momentsLabels: PropTypes.array,
	content: PropTypes.string,
	version: PropTypes.object.isRequired,
	refHeading: PropTypes.string,
	bibleChapterLink: PropTypes.string,
	bibleReferences: PropTypes.array,
	bibleVerses: PropTypes.object,
	textDirection: PropTypes.string,
	showChapterButton: PropTypes.bool,
	onAudioComplete: PropTypes.func,
	audioStart: PropTypes.number,
	audioStop: PropTypes.number,
	audioPlaying: PropTypes.bool,
	hosts: PropTypes.object,
	dispatch: PropTypes.func.isRequired,
}

PlanRef.defaultProps = {
	getChapter: () => {},
	audio: null,
	verseColors: [],
	highlightColors: [],
	momentsLabels: [],
	content: '',
	refHeading: '',
	bibleChapterLink: '',
	bibleReferences: [],
	bibleVerses: null,
	textDirection: 'ltr',
	showChapterButton: true,
	onAudioComplete: () => {},
	audioStart: 0,
	audioStop: null,
	audioPlaying: false,
	hosts: null,
}

export default PlanRef
