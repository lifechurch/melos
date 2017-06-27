import React, { Component, PropTypes } from 'react'
import { routeActions } from 'react-router-redux'
import PlanNavigation from './PlanNavigation'
// utils
import { getVerseAudioTiming } from '../../../../lib/readerUtils'
import { selectImageFromList } from '../../../../lib/imageUtil'

class PlanReader extends Component {


	render() {
		const {
			plan,
			day,
			contentNum,
			totalSegments,
			previousPath,
			nextPath,
			subLink,
			showCheckmark,
			handleContentCheck,
			bible,
			hosts,
			auth,
			dispatch,
			isRtl,
			showFullChapter,
			children
		} = this.props
		// const { audioPlaying, showFullChapter } = this.state

		// this.isFinalReadingForDay = isFinalReadingForDay(
		// 	this.dayObj,
		// 	this.reference,
		// 	this.isCheckingDevo
		// )
		// this.isFinalPlanDay = isFinalPlanDay(
		// 	this.dayNum,
		// 	plan.calendar,
		// 	plan.total_days
		// )

		let referenceContent, refHeading, showChapterButton, audio, audioTiming, bibleChapterLink
		// if (!isNaN(this.contentIndex)) {
		// 	this.chapReference = typeof this.reference === 'string'
		// 		? this.reference.split('.').splice(0, 2).join('.')
		// 		: ''
		//
		// 	if (typeof window !== 'undefined') {
		// 		bibleChapterLink = `${window.location.origin}/bible/${bible.version.id}/${this.chapReference}`
		// 	}
		//
		// 	// if every case, either chapter call, or bibleaudio call, we're gonna put the audio
		// 	// into audioChapter keyed by reference
		// 	audio = bible.audioChapter[this.chapReference]
		// 	// render the full chapter content if the user clicked the button for read full
		// 	// chapter. note this does not cover when the actual plan reference is a full chapter, if
		// 	// that is the case, then the ref content is just going to be the full chapter where verse content is
		// 	// stored in calendar
		// 	if (showFullChapter && bible.chapter && bible.chapter.reference) {
		// 		referenceContent = bible.chapter.content
		// 		refHeading = bible.chapter.reference.human
		// 		audio = bible.audio
		// 		showChapterButton = false
		// 	} else {
		// 		referenceContent = this.dayObj.reference_content[this.contentIndex].content
		// 		refHeading = this.dayObj.reference_content[this.contentIndex].reference.human
		// 		const splitRefs = this.reference.split('+')
		// 		const isVerse = (splitRefs[0].split('.').length === 3)
		// 		if (audio && audio.timing) {
		// 			const startRef = splitRefs[0]
		// 			const endRef = splitRefs.pop()
		// 			audioTiming = getVerseAudioTiming(startRef, endRef, audio.timing)
		// 		}
		// 		// don't show the button unless we're rendering verses (not full chapter)
		// 		if (isVerse) {
		// 			showChapterButton = true
		// 		} else {
		// 			showChapterButton = false
		// 		}
		// 	}
		// }

		return (
			<div>
				<PlanNavigation
					planName={plan ? plan.name.default : null}
					planImgUrl={plan && plan.images ?
						selectImageFromList({
							images: plan.images,
							width: 640,
							height: 320
						}).url :
						null
					}
					day={day}
					previous={previousPath}
					next={nextPath}
					subLink={subLink}
					contentNum={contentNum}
					totalSegments={totalSegments}
					showCheckmark={showCheckmark}
					onHandleComplete={handleContentCheck}
					isRtl={isRtl()}
					// if we're rendering the full chapter from button click, let's
					// update the arrow positioning
					updateStyle={!showChapterButton}
				/>
				<div className='row plan-reader-content'>
					<div className='columns large-6 medium-8 medium-centered'>
						{ children }
					</div>
				</div>
			</div>
		)
	}
}

PlanReader.propTypes = {
	plan: PropTypes.object.isRequired,
	bible: PropTypes.object.isRequired,
	showFullChapter: PropTypes.bool,
	dispatch: PropTypes.func.isRequired,
	hosts: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
}

PlanReader.defaultProps = {
	showFullChapter: false
}

export default PlanReader
