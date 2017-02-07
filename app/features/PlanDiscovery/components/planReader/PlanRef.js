import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../actions/creators'
import {
	handleVerseSelect,
	handleVerseSelectionClear,
	USER_READER_SETTINGS
} from '../../../../lib/readerUtils'

class PlanRef extends Component {

	constructor(props) {
		super(props)

		this.refToThis = this
	}

	/**
	 * this updates this.state.verseSelection and this.state.deletableColors
	 * for the VerseAction component, and also populates app state with the required
	 * data for verseActions
	 */
	handleOnVerseSelect = (verseSelection) => {
		const { hosts, bible, bible: { version: { id, local_abbreviation }, planDay: { reference: { human, usfm } }, verseColors }, dispatch } = this.props
		const refUrl = `${hosts.railsHost}/${id}/${usfm[0].split('.').slice(0, 1).join('.')}.${verseSelection.human}`
		// if we don't have highlight colors yet, populate them
		if (!bible.highlightColors) {
			dispatch(ActionCreators.highlightColors(true))
		}
		// if we don't have labels for bookmarks yet, let's populate them
		if (!bible.momentsLabels) {
			dispatch(ActionCreators.momentsLabels(true))
		}

		handleVerseSelect(
			this.refToThis,
			verseSelection,
			refUrl,
			id,
			local_abbreviation,
			human,
			usfm,
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
			verses,
			references,
			textDirection,
		} = this.props

		const {
			verseSelection,
			deletableColors,
		} = this.state


		let chapterContent = (
			<Chapter
				{...this.props}
				// TODO: merge the verse objects together in a way to work
				// with the chapter component
				chapter={verses[0]}
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
		let verseActionDiv = (
			<VerseAction
				// props
				{...this.props}
				highlightColors={highlightColors}
				verseColors={verseColors}
				momentsLabels={momentsLabels}
				verses={verses}
				references={references}
				// state
				selection={verseSelection}
				deletableColors={deletableColors}
				onClose={this.handleOnVerseClear}
			/>
		)

		return (
			<div>
				<p>Plan Day Ref</p>
			</div>
		)
	}
}

PlanRef.propTypes = {

}

export default PlanRef
