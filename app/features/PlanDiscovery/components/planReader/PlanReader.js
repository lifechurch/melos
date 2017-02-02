import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../actions/creators'
import PlanNavigation from './PlanNavigation'
import isFinalReadingContent from '../../../../lib/readingPlanUtils'



class PlanReader extends Component {

	constructor(props) {
		super(props)

		this.state = {

		}
	}

	handleComplete = () => {
		const { dispatch, plan } = this.props
		// make api call
		dispatch(ActionCreators.updateCompletion({
			id: plan.id,
			day: this.dayNum,
			references: this.references,
			devotional: plan.calendar[this.dayNum].additional_content.completed,
		}))
	}

	render() {
		const { plan, location: { query: { day, content }, pathname } } = this.props

		if (!plan || !day) {
			return (
				<div></div>
			)
		}

		this.dayNum = parseInt(day, 10)
		const contentIndex = parseInt(content, 10)
		const dayObj = plan.calendar[day]
		const numRefs = dayObj.references.length
		const totalContentsNum = dayObj.additional_content.completed !== null ? (numRefs + 1) : numRefs
		this.reference = dayObj.references[contentIndex]

		// if no content was passed in the url, we know that devo is being rendered
		const hasDevo = (dayObj.additional_content.completed !== null)
		const isCheckingDevo = isNaN(contentIndex) && hasDevo
		const isFinalContent = isFinalReadingContent(dayObj, this.reference, isCheckingDevo)
		const basePath = `${pathname.replace('/devo', '').replace('/ref', '')}`
		// figure out number to display for which content the user is currently on
		let whichContent
		if (hasDevo) {
			if (isCheckingDevo) {
				whichContent = 1
			} else {
				whichContent = contentIndex + 2
			}
		} else {
			whichContent = contentIndex + 1
		}

		let previous, next = null
		// figure out nav links for previous
		if (isCheckingDevo) {
			// nothing previous if on devo
			previous = null
		} else if (contentIndex === 0) {
			// if on first ref, then devo is previous
			previous = `/${basePath}/devo?day=${this.dayNum}`
		} else {
			// previous content
			previous = `/${basePath}/ref?day=${this.dayNum}&content=${contentIndex - 1}`
		}
		// figure out nav links for next
		if (isFinalContent) {
			// day complete
			next = `/${basePath}?day=${this.dayNum}&complete=true`
		} else if (contentIndex + 1 > numRefs) {
			// overview page if not last remaining ref, and is last ref in order
			next = `/${basePath}`
		} else if (isCheckingDevo) {
			// if on devo, next is content 0
			next = `/${basePath}/ref?day=${this.dayNum}&content=0`
		} else {
			// next content
			next = `/${basePath}/ref?day=${this.dayNum}&content=${contentIndex + 1}`
		}

		const devoContent = dayObj.additional_content.html.default
		// we'll have the references in state for the day, keyed by usfm string,
		// so we can grab the actual reference html from there with the following key
		// references = props.references[plan.calendar[day].references[content] .... ]
		return (
			<div>
				<PlanNavigation
					localizedLink={this.props.localizedLink}
					plan={plan}
					day={this.dayNum}
					previous={previous}
					next={next}
					whichContent={whichContent}
					totalContentsNum={totalContentsNum}
					isFinalContent={isFinalContent}
					handleComplete={this.handleComplete}
				/>
				{
					// render the devo or ref component (child of PlanReaderView based on route)
					// with the params from the url
					React.cloneElement(this.props.children, {
						devoContent,
						plan,
					})
				}
			</div>
		)
	}
}

PlanReader.propTypes = {

}

PlanReader.defaultProps = {

}

export default PlanReader