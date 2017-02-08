import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../actions/creators'
import BibleActionCreator from '../../../Bible/actions/creators'
import PlanNavigation from './PlanNavigation'
import isFinalReadingContent from '../../../../lib/readingPlanUtils'

class PlanReader extends Component {

	buildNavLinks() {
		const { location: { pathname } } = this.props
		const basePath = `${pathname.replace('/devo', '').replace('/ref', '')}`
		let previous, next = null
		// figure out nav links for previous
		if (this.isCheckingDevo) {
			// nothing previous if on devo
			previous = null
		} else if (this.contentIndex === 0) {
			// if on first ref, then devo is previous
			if (this.hasDevo) {
				previous = `/${basePath}/devo?day=${this.dayNum}`
			} else {
				previous = null
			}
		} else {
			// previous content
			previous = `/${basePath}/ref?day=${this.dayNum}&content=${this.contentIndex - 1}`
		}

		// figure out nav links for next
		if (this.isFinalContent) {
			// day complete
			next = `/${basePath}?day=${this.dayNum}&complete=true`
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

		return { previous, next, dayBasePath: `/${basePath}?day=${this.dayNum}` }
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
				plan.calendar[this.dayNum].additional_content.completed
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


	render() {
		const { plan, location: { query: { day, content } }, bible, hosts, auth, dispatch } = this.props

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
							content: this.dayObj.reference_content[this.contentIndex].content,
							version: bible.version,
							verseColors: bible.verseColors,
							highlightColors: bible.highlightColors,
							momentsLabels: bible.momentsLabels,
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
