import React, { Component, PropTypes } from 'react'
import { routeActions } from 'react-router-redux'
import BibleActionCreator from '../../../Bible/actions/creators'
import PlanNavigation from './PlanNavigation'
import isFinalReadingForDay, { isFinalPlanDay, dayHasDevo, handleRefUpdate } from '../../../../lib/readingPlanUtils'
import { getVerseAudioTiming } from '../../../../lib/readerUtils'

class PlanReader extends Component {

	constructor(props) {
		super(props)
		this.state = {
			audioPlaying: false,
		}
	}

	onAudioComplete = () => {
		const { dispatch } = this.props

		this.handleComplete()
		dispatch(routeActions.push(this.navLinks.next))
		// if audio has completed a ref then keep it playing for the next one
		this.setState({ audioPlaying: true })
	}

	getChapter = () => {
		const { dispatch, bible: { version: { id } } } = this.props
		dispatch(BibleActionCreator.bibleChapter({
			id,
			reference: this.chapReference,
			format: 'html'
		}))
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

		if (!this.dayObj.completed) {
			handleRefUpdate(
				this.dayObj.references_completed,
				this.isCheckingDevo,
				this.hasDevo,
				this.dayObj.additional_content.completed,
				this.reference,
				true,
				plan.id,
				this.dayNum,
				dispatch
			)
		}
	}

	buildNavLinks() {
		const { location: { pathname } } = this.props
		const dayBasePath = `${pathname.replace('/devo', '').replace(`/ref/${this.contentIndex}`, '')}`
		let previous, next = null
		// figure out nav links for previous
		if (this.isCheckingDevo) {
			previous = dayBasePath
		} else if (this.contentIndex === 0) {
			// if on first ref, then devo is previous
			if (this.hasDevo) {
				previous = `${dayBasePath}/devo`
			} else {
				previous = dayBasePath
			}
		} else {
			// previous content
			previous = `${dayBasePath}/ref/${this.contentIndex - 1}`
		}

		// figure out nav links for next
		if (this.isFinalReadingForDay) {
			if (this.isFinalPlanDay) {
				// plan complete
				next = `${dayBasePath.replace(`/day/${this.dayNum}`, '')}/completed`
			} else {
				// day complete
				next = `${dayBasePath}/completed`
			}
		} else if (this.contentIndex + 1 === this.numRefs) {
			// overview page if not last remaining ref, and is last ref in order
			next = dayBasePath
		} else if (this.isCheckingDevo) {
			// if on devo, next is content 0
			next = `${dayBasePath}/ref/0`
		} else {
			// next content
			next = `${dayBasePath}/ref/${this.contentIndex + 1}`
		}

		return { previous, next, dayBasePath }
	}


	render() {
		const { plan, params, bible, hosts, auth, dispatch, isRtl } = this.props
		const { audioPlaying } = this.state
		const { day, content } = params
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
		this.hasDevo = 	dayHasDevo(this.dayObj.additional_content)
		this.totalContentsNum = this.hasDevo ? (this.numRefs + 1) : this.numRefs
		// if no content was passed in the url, we know that devo is being rendered
		this.isCheckingDevo = isNaN(this.contentIndex) && this.hasDevo
		this.isFinalReadingForDay = isFinalReadingForDay(
			this.dayObj,
			this.reference,
			this.isCheckingDevo
		)
		this.isFinalPlanDay = isFinalPlanDay(
			this.dayNum,
			plan.calendar,
			plan.total_days
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
				if (audio) {
					audioTiming = getVerseAudioTiming(startRef, endRef, audio.timing)
				}
				showChapterButton = true
			}
		}

		return (
			<div>
				<PlanNavigation
					localizedLink={this.props.localizedLink}
					planName={plan.name.default}
					planImgUrl={plan.images ? plan.images[2].url : 'https://s3.amazonaws.com/yvplans-staging/default/720x405.jpg'}
					day={this.dayNum}
					previous={this.navLinks.previous}
					next={this.navLinks.next}
					dayBasePath={this.navLinks.dayBasePath}
					whichContent={this.whichContent}
					totalContentsNum={this.totalContentsNum}
					isFinalContent={this.isFinalReadingForDay}
					onHandleComplete={this.handleComplete}
					isRtl={isRtl()}
					// if we're rendering the full chapter from button click, let's
					// update the arrow positioning
					updateStyle={!showChapterButton}
				/>
				<div className='row plan-reader-content'>
					<div className='columns large-6 medium-8 medium-centered'>
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
								isRtl: isRtl(),
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
			</div>
		)
	}
}

PlanReader.propTypes = {
	plan: PropTypes.object.isRequired,
	bible: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	hosts: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
	localizedLink: PropTypes.func.isRequired,
}

PlanReader.defaultProps = {

}

export default PlanReader
