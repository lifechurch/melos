import React, { Component } from 'react'
import { connect } from 'react-redux'
import rtlDetect from 'rtl-detect'
import { routeActions } from 'react-router-redux'
// actions
import subscriptionDay from '@youversion/api-redux/lib/batchedActions/subscriptionDay'
import subscriptionDayUpdate from '@youversion/api-redux/lib/batchedActions/subscriptionDayUpdate'
// models
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
// selectors
// utils
import { calcCurrentPlanDay, isFinalSegment } from '../lib/readingPlanUtils'
import Routes from '../lib/routes'
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
		const { params: { day, subscription_id, id }, dispatch, auth } = this.props

		dispatch(subscriptionDayUpdate({
			contentIndex,
			complete,
			daySegments: this.daySegments,
			dayProgress: this.dayProgress,
			subscription_id,
			day
		}))

		if (isFinalSegment(contentIndex, this.dayProgress.partial)) {
			dispatch(routeActions.push(Routes.subscriptionDayComplete({
				username: auth.userData.username,
				plan_id: id.split('-')[0],
				slug: id.split('-')[1],
				subscription_id,
				day,
			})))
		}
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
			this.dayProgress = progressDays && progressDays[this.currentDay - 1] ?
													progressDays[this.currentDay - 1] :
													null
			progressString = subscription.overall ?
												subscription.overall.progress_string :
												null
		}
		this.daySegments = plan && plan.days && plan.days[this.currentDay - 1] ?
												plan.days[this.currentDay - 1].segments :
												null

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
