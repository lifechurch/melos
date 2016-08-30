import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../actions/creators'
import { Link } from 'react-router'
import CheckMark from '../../../components/CheckMark'
import SubscribeUserAction from './SubscribeUserAction'
import SaveForLaterAction from './SaveForLaterAction'

class PlanActionButtons extends Component {

	render() {
		const { readingPlan, auth, dispatch } = this.props

		return (
			<div className='rp-subscription-info'>
				<SubscribeUserAction readingPlan={readingPlan} auth={auth} dispatch={dispatch}/>
				<div className='text-center'>
					<SaveForLaterAction readingPlan={readingPlan} auth={auth} dispatch={dispatch}/>
					&bull;
					<a href={`/reading-plans/${readingPlan.id}-${readingPlan.slug}/day/1`}> <FormattedMessage id="plans.sample" /></a>
				</div>
			</div>
		)
	}
}

export default PlanActionButtons