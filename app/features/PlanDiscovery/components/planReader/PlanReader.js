import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { routeActions } from 'react-router-redux'
import ActionCreators from '../../actions/creators'
import BibleActionCreator from '../../../Bible/actions/creators'
import PlanNavigation from './PlanNavigation'
import isFinalReadingContent from '../../../../lib/readingPlanUtils'
import { getVerseAudioTiming } from '../../../../lib/readerUtils'

class PlanReader extends Component {

	constructor(props) {
		super(props)
		this.state = {
			audioPlaying: false,
		}
	}

	buildNavLinks() {
		const { location: { pathname } } = this.props
		const basePath = `${pathname.replace('/devo', '').replace('/ref', '')}`
		const dayBasePath = `/${basePath}?day=${this.dayNum}`
		let previous, next = null
		// figure out nav links for previous
		if (this.isCheckingDevo) {
			// nothing previous if on devo
			previous = dayBasePath
		} else if (this.contentIndex === 0) {
			// if on first ref, then devo is previous
			if (this.hasDevo) {
				previous = `/${basePath}/devo?day=${this.dayNum}`
			} else {
				previous = dayBasePath
			}
		} else {
			// previous content
			previous = `/${basePath}/ref?day=${this.dayNum}&content=${this.contentIndex - 1}`
		}

		// figure out nav links for next
		if (this.isFinalContent) {
			// day complete
			next = `/${basePath}/day/${this.dayNum}/completed`
		} else if (this.contentIndex + 1 === this.numRefs) {
			// overview page if not last remaining ref, and is last ref in order
			next = `/${basePath}?day=${this.dayNum}`
		} else if (this.isCheckingDevo) {
			// if on devo, next is content 0
			next = `/${basePath}/ref?day=${this.dayNum}&content=0`
		} else {
			// next content
			next = `/${basePath}/ref?day=${this.dayNum}&content=${this.contentIndex + 1}`
		}

		return { previous, next, dayBasePath }
	}

	getWhichContentNum() {
		// figure out number to display for which content the user is currently on
		let whichContent
		if (this.hasDevo) {
			if (this.isCheckingDevo) {
				whichContent = 1
			} else {
				whichContent = this.contentIndex + 2
			}
		} else {
			whichContent = this.contentIndex + 1
		}
		return whichContent
	}

	handleComplete = () => {
		const { dispatch, plan } = this.props
		let completeDevo = true
		const references = this.dayObj.references_completed
		// devotional is true by default if there is no devotional
		// otherwise this will overwrite with the correct value
		if (this.hasDevo) {
			completeDevo =
				this.isCheckingDevo ||
				plan.calendar[this.dayNum - 1].additional_content.completed
		}
		// if we have a reference, that we're reading through,
		// add it to the list of completedRefs
		if (this.reference) {
			references.push(this.reference)
		}
		// make api call
		dispatch(ActionCreators.updatePlanDay({
			id: plan.id,
			day: this.dayNum,
			references,
			devotional: completeDevo,
		}, true))
	}

	getChapter = () => {
		const { dispatch, bible: { version: { id } } } = this.props
		dispatch(BibleActionCreator.bibleChapter({
			id,
			reference: this.chapReference,
			format: 'html'
		}))
	}

	onAudioComplete = () => {
		const { dispatch } = this.props

		this.handleComplete()
		dispatch(routeActions.push(this.navLinks.next))
		// if audio has completed a ref then keep it playing for the next one
		this.setState({ audioPlaying: true })
	}

	render() {
		const { plan, location: { query: { day, content } }, bible, hosts, auth, dispatch } = this.props
		const { audioPlaying } = this.state

		if (Object.keys(plan).length === 0 || !day) {
			return (
				<div />
			)
		}

		this.dayNum = parseInt(day, 10)
		this.contentIndex = parseInt(content, 10)
		this.dayObj = plan.calendar[this.dayNum - 1]
		this.numRefs = this.dayObj.references.length
		this.reference = this.dayObj.references[this.contentIndex]
		// if no content was passed in the url, we know that devo is being rendered
		this.hasDevo = 	(!!this.dayObj.additional_content.html) ||
										(!!this.dayObj.additional_content.text)
		this.totalContentsNum = this.hasDevo ? (this.numRefs + 1) : this.numRefs
		this.isCheckingDevo = isNaN(this.contentIndex) && this.hasDevo
		this.isFinalContent = isFinalReadingContent(
			this.dayObj,
			this.reference,
			this.isCheckingDevo
		)
		this.navLinks = this.buildNavLinks()
		this.whichContent = this.getWhichContentNum()

		let devoContent
		if (this.hasDevo) {
			if (this.dayObj.additional_content.html) {
				devoContent = this.dayObj.additional_content.html.default
			} else {
				devoContent = this.dayObj.additional_content.text.default
			}
		}

		let referenceContent, refHeading, showChapterButton, audio, audioTiming, bibleChapterLink
		if (!isNaN(this.contentIndex)) {
			this.chapReference = this.reference.split('.').splice(0, 2).join('.')
			if (typeof window !== 'undefined') {
				bibleChapterLink = `${window.location.origin}/bible/${bible.version.id}/${this.chapReference}`
			}
			// render the full chapter content if the user clicked the button for read full
			// chapter. this checks to make sure the chapter matches the rendered ref
			if ('content' in bible.chapter && bible.chapter.reference.usfm === this.reference.split('.').splice(0, 2).join('.')) {
				referenceContent = bible.chapter.content
				refHeading = bible.chapter.reference.human
				audio = bible.audio
				showChapterButton = false
			} else {
				referenceContent = this.dayObj.reference_content[this.contentIndex].content
				refHeading = this.dayObj.reference_content[this.contentIndex].reference.human
				audio = bible.audioChapter[this.chapReference]
				const startRef = this.reference.split('+')[0]
				const endRef = this.reference.split('+').pop()
				audioTiming = getVerseAudioTiming(startRef, endRef, audio.timing)
				showChapterButton = true
			}
		}

		return (
			<div>
				<PlanNavigation
					localizedLink={this.props.localizedLink}
					plan={plan}
					day={this.dayNum}
					previous={this.navLinks.previous}
					next={this.navLinks.next}
					dayBasePath={this.navLinks.dayBasePath}
					whichContent={this.whichContent}
					totalContentsNum={this.totalContentsNum}
					isFinalContent={this.isFinalContent}
					onHandleComplete={this.handleComplete}
				/>
				<div className='plan-reader-content'>
					{
						// render the devo or ref component (child of PlanReaderView based on route)
						React.cloneElement(this.props.children, {
							devoContent,
							bibleReferences: bible.verses.references,
							bibleVerses: bible.verses.verses,
							bibleChapterLink,
							content: referenceContent,
							refHeading,
							showChapterButton,
							audio,
							audioStart: audioTiming ? audioTiming.startTime : null,
							audioStop: audioTiming ? audioTiming.endTime : null,
							audioPlaying,
							onAudioComplete: this.onAudioComplete,
							version: bible.version,
							verseColors: bible.verseColors,
							highlightColors: bible.highlightColors,
							momentsLabels: bible.momentsLabels,
							getChapter: this.getChapter,
							auth,
							hosts,
							dispatch
						})
					}
				</div>
			</div>
		)
	}
}

PlanReader.propTypes = {

}

PlanReader.defaultProps = {

}

export default PlanReader
