import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Plan from '../features/PlanDiscovery/components/Plan'
import Sample from '../features/PlanDiscovery/components/PlanDay'

class LookinsideSample extends Component {

	render() {
		const { plan, dispatch, auth, params } = this.props

		if (!plan) {
			return (
				<div />
			)
		}

		if (false) {
			return <div />
		} else {
			// overwrite actions div in sample view to show the landing page copy
			const actionsNode = (
				<div>
					<div>Some copy</div>
					<Link to={'/sign-up'}>
						<button className='solid-button green padded'>
						Create My Free Account
					</button>
					</Link>
				</div>
		)
			return (
				<div className='row'>
					<Plan
						dispatch={dispatch}
						plan={plan}
						params={params}
						auth={auth}
						dayBaseLink={`/lookinside/${plan.id}-${plan.slug}/read`}
					>
						<Sample
							// plan={plan}
							// day={dayNum}
							// dayData={dayContent}
							// calendar={plan.calendar}
							// totalDays={plan.total_days}
							// aboutLink={}
							// subscriptionLink={`/lookinside/${plan.id}-${plan.slug}/read`}
							actionsNode={actionsNode}
							// startLink={''}
							// bibleLink={'/bible'}
							// isSaved={false}
							// devoCompleted={dayContent.additional_content.completed}
							// hasDevo={!!(dayContent.additional_content.html || dayContent.additional_content.text)}
						/>
					</Plan>
				</div>
			)
		}
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
