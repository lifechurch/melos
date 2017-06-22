import React, { Component } from 'react'
import { connect } from 'react-redux'
import rtlDetect from 'rtl-detect'
import Immutable from 'immutable'
// actions
import subscriptionDay from '@youversion/api-redux/lib/batchedActions/subscriptionDay'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
// models
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
// selectors
// utils
import { calcCurrentPlanDay, isDayComplete } from '../lib/readingPlanUtils'
import getCurrentDT from '../lib/getCurrentDT'
// components
import PlanComponent from '../features/PlanDiscovery/components/Plan'


class Plan extends Component {
	componentDidMount() {
		const { dispatch, params: { id, subscription_id, day }, serverLanguageTag } = this.props
		if (subscription_id) {
			const plan_id = id.split('-')[0]
			// get sub data
			dispatch(subscriptionDay({
				plan_id,
				subscription_id,
				language_tag: serverLanguageTag,
				day,
			}))
		}
	}

	localizedLink(link) {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	isRtl() {
		const { params, serverLanguageTag } = this.props
		const languageTag = params.lang || serverLanguageTag || 'en'
		return rtlDetect.isRtlLang(languageTag)
	}

	handleCatchUp = () => {
		const { dispatch, start_dt, subscription } = this.props
		return null
	}

	OnContentCheck = ({ contentIndex, complete }) => {
		const { dispatch, params: { subscription_id } } = this.props
		let partial
		// if we already have a completion list, set the new complete val
		if (this.dayProgress.partial) {
			partial = Immutable
			.fromJS(this.dayProgress.partial)
			.set(contentIndex, complete)
			.toJS()
		} else {
		// otherwise, we need to build out the list based off of the daysegments and
		// set the new complete val
			partial = this.daySegments.map((seg, i) => {
				// set the other segments to whether or not the day was complete
				// (if it was complete and now we're unchecking a seg, then we want
				// the other segs to be true, and vice versa)
				return contentIndex === i ?
								complete :
								this.dayProgress.complete
			})
		}

		dispatch(plansAPI.actions.progressDay.put({
			id: subscription_id,
			day: this.currentDay,
		}, {
			body: {
				partial,
				complete: isDayComplete(partial),
				updated_dt: getCurrentDT(),
			},
			auth: true,
		}))
	}

	render() {
		const { children, subscription, plan, params: { day } } = this.props

		this.daySegments = null
		this.currentDay = null
		this.dayProgress = null
		let progressDays = null
		let progressString = null
		let subscription_id = null
		const together_id = subscription && 'together_id' in subscription ?
												subscription.together_id : null
		if (plan && subscription && subscription.start_dt) {
			subscription_id = subscription.id
			this.currentDay = day ||
										calcCurrentPlanDay({
											total_days: plan.total_days,
											start_dt: subscription.start_dt
										})
			progressDays = subscription.days ?
											subscription.days :
											null
			this.dayProgress = progressDays && progressDays[day - 1] ?
													progressDays[day - 1] :
													null
			progressString = subscription.overall ?
												subscription.overall.progress_string :
												null
		}
		if (plan && plan.days) {
			this.daySegments = plan.days && plan.days[day - 1] ?
													plan.days[day - 1].segments :
													null
		}

		return (
			<PlanComponent
				{...this.props}
				localizedLink={::this.localizedLink}
				isRtl={::this.isRtl}
				together_id={together_id}
				day={this.currentDay}
				progressDays={progressDays}
				dayProgress={this.dayProgress}
				daySegments={this.daySegments}
				progressString={progressString}
				subscription_id={subscription ? subscription.id : null}
				handleContentCheck={this.OnContentCheck}
			>
				{
					children &&
					React.cloneElement(children, {
						localizedLink: ::this.localizedLink,
						isRtl: ::this.isRtl,
						together_id,
						day: this.currentDay,
						progressDays,
						subscription_id,
					})
				}
			</PlanComponent>
		)
	}
}

function mapStateToProps(state, props) {
	const { params: { id, subscription_id } } = props
	const plan_id = id.split('-')[0]
	console.log('SUBSMODEL', getSubscriptionModel(state))
	console.log('PLANSMODEL', getPlansModel(state))
	return {
		plan: getPlansModel(state) && plan_id in getPlansModel(state).byId ?
					getPlansModel(state).byId[plan_id] :
					null,
		subscription: getSubscriptionModel(state) && subscription_id in getSubscriptionModel(state).byId ?
									getSubscriptionModel(state).byId[subscription_id] :
									null,
		savedPlans: state.readingPlans && state.readingPlans.savedPlans ? state.readingPlans.savedPlans : null,
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts
	}
}

Plan.propTypes = {

}

export default connect(mapStateToProps, null)(Plan)
// export default Plan
