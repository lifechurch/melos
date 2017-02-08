import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../actions/creators'
import BibleActionCreator from '../../../Bible/actions/creators'
import Chapter from '../../../Bible/components/content/Chapter'
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

		const refUrl = `${hosts.railsHost}/${id}/${verses[0].reference.usfm[0].split('.').slice(0, 1).join('.')}.${verseSelection.human}`
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
			verses[0].reference.human,
			verseColors,
			dispatch,
		)

	}

	handleOnVerseClear = () => {
		const refToChapter = this.chapterInstance
		handleVerseSelectionClear(this.refToThis, refToChapter)
	}

	render() {
		const {
			verseColors,
			highlightColors,
			momentsLabels,
			content,
			version,
			bibleReferences,
			bibleVerses,
			textDirection,
			auth
		} = this.props

		// these state variables are set and maintained by the
		// handleOnVerseSelect and handleOnVerseClear
		const {
			verseSelection,
			deletableColors,
		} = this.state

		const chapterContent = (
			<Chapter
				{...this.props}
				content={content}
				versionID={version.id}
				copyright={version.copyright_short}
				verseColors={verseColors}
				fontSize={USER_READER_SETTINGS.fontSize}
				fontFamily={USER_READER_SETTINGS.fontFamily}
				onSelect={this.handleOnVerseSelect}
				showFootnotes={USER_READER_SETTINGS.showFootnotes}
				showVerseNumbers={USER_READER_SETTINGS.showVerseNumbers}
				textDirection={textDirection}
				ref={(chapter) => { this.chapterInstance = chapter }}
			/>
		)
		const verseActionDiv = (
			<VerseAction
				// props
				{...this.props}
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
		)
		console.log(this.state.verseSelection);
// TODO: pass param to verses call for parallel verses or not. parallel will
// be equivalent to the single verse page
// not parallel will be for the reading plans refs and we'll build the
// ref data in a similar struture, except it won't be in an object with the
// versionID-USFM being the key, rather, an array of separate verses objects ?
		return (
			<div className='columns large-6 medium-10 medium-centered'>
				<p>Plan Day Ref</p>
				{ chapterContent }
				{ verseActionDiv }
			</div>
		)
	}
}

PlanRef.propTypes = {

}

export default PlanRef
