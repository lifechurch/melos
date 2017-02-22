import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import UnsubbedPlan from '../features/PlanDiscovery/components/UnsubbedPlan'

const COPY = {
	plans_description: 'Sometimes called Reading Plans or Devotionals, we call them “Bible Plans” because they give you daily portions of Scripture paired with devotional, audio, or video selections.',
	account_blurb: 'We hope this Plan is helping you engage with the Bible. If you’d like to keep track of which days you’ve completed, you’ll need a free account — and it IS completely free, with no ads, no strings attached. Your free account simply gives you one convenient storage place for your YouVersion Bible activity. '
}

class LookinsideSample extends Component {

	render() {
		const { plan, dispatch, auth, params, children } = this.props

		if (!plan) {
			return (
				<div />
			)
		}
		// overwrite actions div in sample view to show the landing page copy
		const actionsNode = (
			<div className='lookinside-actions'>
				<div className='copy'>{ COPY.account_blurb }</div>
				<Link to={'/sign-up'}>
					<button className='solid-button green padded'>
					Create My Free Account
				</button>
				</Link>
			</div>
		)
		console.log(params)

		return (
			<div className='row'>
				<UnsubbedPlan
					{...this.props}
					dispatch={dispatch}
					plan={plan}
					params={params}
					auth={auth}
					actionsNode={actionsNode}
					dayBasePath={`/lookinside/${plan.id}-${plan.slug}/read`}
				>
					{ children }
				</UnsubbedPlan>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		plan: state.readingPlans && state.readingPlans.fullPlans && state.readingPlans.fullPlans._SELECTED ? state.readingPlans.fullPlans._SELECTED : null,
		bible: state.bibleReader,
		location: state.routing && state.routing.location ? state.routing.location : null,
		auth: state.auth,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(LookinsideSample)
