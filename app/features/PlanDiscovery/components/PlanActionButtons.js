import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../actions/creators'
import { Link } from 'react-router'
import CheckMark from '../../../components/CheckMark'
import SubscribeUserAction from './SubscribeUserAction'
import SaveForLaterAction from './SaveForLaterAction'

class PlanActionButtons extends Component {

	samplePlan(plan) {
		// redirect to sample plan
		window.location.replace(`/reading-plans/${plan.id}-${plan.slug}/day/1`)
	}

	render() {
		const { readingPlan, auth, dispatch } = this.props

		return (
			<div className='rp-subscription-info'>
				<SubscribeUserAction readingPlan={readingPlan} auth={auth} dispatch={dispatch}/>
				<div className='text-center'>
					<SaveForLaterAction readingPlan={readingPlan} auth={auth} dispatch={dispatch}/>
					&bull;
					<a onClick={this.samplePlan.bind(this, readingPlan)}> <FormattedMessage id="plans.sample" /></a>
				</div>
			</div>
		)
	}
}

export default PlanActionButtons