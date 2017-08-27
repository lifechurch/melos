import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { push } from 'react-router-redux'
// actions
import subscriptionData from '@youversion/api-redux/lib/batchedActions/subscriptionData'
// models
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
// selectors
// utils
import Routes from '../lib/routes'
// components


class TalkItOverRedirect extends Component {
	componentDidMount() {
		const { dispatch, params: { subscription_id, day }, auth } = this.props
		if (!auth.isLoggedIn) {
			dispatch(push(
				Routes.signIn({})
			))
		} else if (subscription_id) {
			dispatch(subscriptionData({ subscription_id, auth, day }))
		}
	}

	componentWillReceiveProps() {
		const { subscription, plans, params: { day, content } } = this.props
		if (
			subscription
			&& subscription.plan_id
			&& plans.byId
			&& subscription.plan_id in plans.byId
			&& plans.byId[subscription.plan_id].days
		) {
			// figure out redirect link
			const plan = plans.byId[subscription.plan_id]
			const segs = plan
				&& plan.days
				&& plan.days[day]
				? plan.days[day].segments
				: null
			// which sub segment index corresponds to the tio number in the url?
			const tioIndices = []
			if (segs) {
				segs.forEach((seg, i) => {
					if (seg.kind === 'talk-it-over') {
						tioIndices.push(i)
					}
				})
			}
			const mappedSegment = tioIndices[content]
			if (mappedSegment && this.username && day) {
				window.location.replace(
					Routes.subscriptionContent({
						username: this.username,
						plan_id: subscription.plan_id,
						subscription_id: subscription.id,
						day,
						content: mappedSegment,
					})
				)
			}
		}
	}

	// in case the redirect fails for some reason, give the user the option to view plans
	render() {
		const { auth } = this.props
		this.username = auth && auth.userData && auth.userData.username

		return (
			<div className='plan-reader-content horizontal-center flex-wrap centered large-6 small-10'>
				<h3 className='text-center' style={{ width: '100%' }}>
					<FormattedMessage id='redirecting' style={{ width: '100%' }} />
				</h3>
				<h5 className='text-center' style={{ width: '100%' }}>
					<FormattedMessage id='talk it over' style={{ width: '100%' }} />
				</h5>
				<a href={Routes.subscriptions({ username: this.username })}>
					<button className='chapter-button'>
						<FormattedMessage id='plans.my plans' />
					</button>
				</a>
			</div>
		)
	}
}

function mapStateToProps(state, props) {
	const { params: { subscription_id } } = props
	return {
		plans: getPlansModel(state),
		subscription: getSubscriptionModel(state) && subscription_id in getSubscriptionModel(state).byId
			? getSubscriptionModel(state).byId[subscription_id]
			: null,
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts
	}
}

TalkItOverRedirect.propTypes = {
	subscription: PropTypes.object.isRequired,
	plans: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	params: PropTypes.object.isRequired,
}

TalkItOverRedirect.defaultProps = {

}

export default connect(mapStateToProps, null)(TalkItOverRedirect)
