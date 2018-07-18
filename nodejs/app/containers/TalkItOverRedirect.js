import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import mapTioIndices from '@youversion/utils/lib/readingPlans/mapTIOIndices'
// actions
import subscriptionData from '@youversion/api-redux/lib/batchedActions/subscriptionData'
// models
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
// selectors
// utils
import Routes from '@youversion/utils/lib/routes/routes'
// components


class TalkItOverRedirect extends Component {
	componentDidMount() {
		const { dispatch, params: { subscription_id, day }, auth, serverLanguageTag } = this.props
		const signin = Routes.signIn({
			query: {
				redirect: window.location.pathname
			}
		})
		if (!auth.isLoggedIn) {
			window.location.replace(signin)
		} else if (subscription_id) {
			dispatch(subscriptionData({ subscription_id, auth, day, serverLanguageTag }))
				.catch(() => {
					// if we don't get any successful promises back from the call, then
					// we most likely are the wrong authed user for the link
					window.location.replace(signin)
				})
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
			const mappedSegment = mapTioIndices(segs)[content]
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
				<Link to={Routes.subscriptions({ username: this.username })}>
					<button className='chapter-button'>
						<FormattedMessage id='plans.my plans' />
					</button>
				</Link>
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
	serverLanguageTag: PropTypes.string.isRequired
}

TalkItOverRedirect.defaultProps = {

}

export default connect(mapStateToProps, null)(TalkItOverRedirect)
