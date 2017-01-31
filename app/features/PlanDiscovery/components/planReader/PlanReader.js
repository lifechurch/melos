import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../actions/creators'
import { FormattedMessage } from 'react-intl'
import PlanNavigation from './PlanNavigation'
import isFinalReadingContent from '../../../../lib/readingPlanUtils'



class PlanReader extends Component {

	constructor(props) {
		super(props)
	}

	onComplete = () => {
		// make api call
	}

	render() {
		const { plan, location: { query: { day, content, id }, pathname } } = this.props

		if (!plan || !day) {
			return (
				<div></div>
			)
		}

		let dayNum = parseInt(day, 10)
		let contentNum = parseInt(content, 10)
		let dayObj = plan.calendar[day]
		let numRefs = dayObj.references.length
		let ref = dayObj.references[contentNum]
		console.log(typeof contentNum)
		// if no content was passed in the url, we know that devo is being rendered
		let isCheckingDevo = isNaN(contentNum)
		let isFinalContent = isFinalReadingContent(dayObj, ref, isCheckingDevo)

		let previous, next = null
		// figure out nav links for previous
		if (isCheckingDevo) {
			// nothing previous if on devo
			previous = null
		} else if (contentNum === 0) {
			// if on first ref, then devo is previous
			previous = `/${pathname.replace('ref', 'devo')}?day=${dayNum}`
		} else {
			// previous content
			previous = `/${pathname}?day=${dayNum}&content=${contentNum - 1}`
		}
		// figure out nav links for next
		if (isFinalContent) {
			// day complete
			next = `/${pathname}?day=${dayNum}&complete=true`
		} else if (contentNum + 1 === numRefs) {
			// overview page if not last remaining ref, and is last ref in order
			next = `/${pathname.replace('/ref', '')}`
		} else if (isCheckingDevo) {
			// if on devo, next is content 0
			next = `/${pathname}?day=${dayNum}&content=0`
		} else {
			// next content
			next = `/${pathname}?day=${dayNum}&content=${contentNum + 1}`
		}

		let devoContent = dayObj.additional_content.html.default
		// we'll have the references in state for the day, keyed by usfm string,
		// so we can grab the actual reference html from there with the following key
		// references = props.references[plan.calendar[day].references[content] .... ]
		return (
			<div>
				<PlanNavigation
					plan={plan}
					day={dayNum}
					previous={previous}
					next={next}
					isFinalContent={isFinalContent}
					onComplete={this.onComplete}
				/>
				{
					// render the devo or ref component (child of PlanReaderView based on route)
					// with the params from the url
					React.cloneElement(this.props.children, {
						devoContent,
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