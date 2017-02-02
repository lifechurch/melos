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
		// make api call
	}

	render() {
		const { plan, location: { query: { day, content, id }, pathname } } = this.props

		if (!plan || !day) {
			return (
				<div></div>
			)
		}

		const dayNum = parseInt(day, 10)
		const contentNum = parseInt(content, 10)
		const dayObj = plan.calendar[day]
		const numRefs = dayObj.references.length
		const ref = dayObj.references[contentNum]
		// if no content was passed in the url, we know that devo is being rendered
		const isCheckingDevo = isNaN(contentNum)
		const isFinalContent = isFinalReadingContent(dayObj, ref, isCheckingDevo)
		const basePath = `${pathname.replace('/devo', '').replace('/ref', '')}`
		console.log(isFinalContent)
		let previous, next = null
		// figure out nav links for previous
		if (isCheckingDevo) {
			// nothing previous if on devo
			previous = null
		} else if (contentNum === 0) {
			// if on first ref, then devo is previous
			previous = `/${basePath}/devo?day=${dayNum}`
		} else {
			// previous content
			previous = `/${basePath}/ref?day=${dayNum}&content=${contentNum - 1}`
		}
		// figure out nav links for next
		if (isFinalContent) {
			// day complete
			next = `/${basePath}?day=${dayNum}&complete=true`
		} else if (contentNum + 1 === numRefs) {
			// overview page if not last remaining ref, and is last ref in order
			next = `/${basePath}`
		} else if (isCheckingDevo) {
			// if on devo, next is content 0
			next = `/${basePath}/ref?day=${dayNum}&content=0`
		} else {
			// next content
			next = `/${basePath}/ref?day=${dayNum}&content=${contentNum + 1}`
		}

		const devoContent = dayObj.additional_content.html.default
		const reference = dayObj.references[contentNum]
		// we'll have the references in state for the day, keyed by usfm string,
		// so we can grab the actual reference html from there with the following key
		// references = props.references[plan.calendar[day].references[content] .... ]
		return (
			<div>
				<PlanNavigation
					localizedLink={this.props.localizedLink}
					plan={plan}
					day={dayNum}
					previous={previous}
					next={next}
					isFinalContent={isFinalContent}
					handleComplete={this.handleComplete}
				/>
				{
					// render the devo or ref component (child of PlanReaderView based on route)
					// with the params from the url
					React.cloneElement(this.props.children, {
						devoContent,
						reference,
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