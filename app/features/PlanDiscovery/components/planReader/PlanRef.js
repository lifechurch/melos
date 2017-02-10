import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import LocalStore from '../../../../lib/localStore'
import ActionCreators from '../../actions/creators'
import PopupMenu from '../../../../components/PopupMenu'
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
			momentsLabels,
			bibleVerses,
			verseColors,
			dispatch
		} = this.props

		const bibleVerse = bibleVerses[Object.keys(bibleVerses)[0]]

		const refUrl = `${hosts.railsHost}/${id}/${bibleVerse.usfm[0].split('.').slice(0, 1).join('.')}.${verseSelection.human}`
		// if we don't have highlight colors yet, populate them
		if (!Array.isArray(highlightColors)) {
			dispatch(BibleActionCreator.momentsColors(true))
		}
		// if we don't have labels for bookmarks yet, let's populate them
		if (Object.keys(momentsLabels).length === 0) {
			dispatch(BibleActionCreator.momentsLabels(true))
		}

		handleVerseSelect(
			this.refToThis,
			verseSelection,
			refUrl,
			id,
			local_abbreviation,
			bibleVerse.human,
			verseColors,
			dispatch,
		)

	}

	handleOnVerseClear = () => {
		const refToChapter = this.chapterInstance
		handleVerseSelectionClear(this.refToThis, refToChapter)
	}

	getChapter = () => {
		const { getChapter } = this.props
		if (typeof getChapter === 'function') {
			getChapter()
		}
	}

	changeReader = () => {
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
			auth
		} = this.props

		// these state variables are set and maintained by the
		// handleOnVerseSelect and handleOnVerseClear
		const {
			verseSelection,
			deletableColors,
		} = this.state

		// TODO: add 'change' string to rails and format it here
		const planRefHeading = (
			<div className='plan-reader-heading'>
				<div className='ref-heading'>
					{`${refHeading} ${version.local_abbreviation.toUpperCase()}`}
					<a
						href={bibleChapterLink}
						className='pill-heading'
						onClick={this.changeReader}
					>
						Change
					</a>
				</div>
				<AudioPopup
					audio={audio}
					hosts={hosts}
					enabled={audio && 'id' in audio}
					onAudioComplete={onAudioComplete}
					startTime={audioStart}
					stopTime={audioStop}
					playing={audioPlaying}
				/>
			</div>
		)

		let fullChapButton = null
		if (showChapterButton) {
			fullChapButton = (
				<div className='buttons'>
					<a className='chapter-button solid-button' onClick={this.getChapter}>
						<FormattedMessage id='Reader.read chapter' />
					</a>
				</div>
			)
		}

		return (
			<div className='plan-ref columns large-6 medium-8 medium-centered'>
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
}

PlanRef.defaultProps = {
	audio: null,
}

export default PlanRef
