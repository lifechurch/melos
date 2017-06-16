import React, { Component } from 'react'
import { connect } from 'react-redux'
import rtlDetect from 'rtl-detect'
// actions
import subscriptionDay from '../../../youversion-api-redux/src/batchedActions/subscriptionDay'
import bibleReferences from '../../../youversion-api-redux/src/batchedActions/bibleReferences'
// models
import getSubscriptionModel from '../../../youversion-api-redux/src/models/subscriptions'
import getPlansModel from '../../../youversion-api-redux/src/models/readingPlans'
import getBibleModel from '../../../youversion-api-redux/src/models/bible'
// selectors
// utils
import { calcCurrentPlanDay } from '../lib/readingPlanUtils'
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

	componentDidUpdate(prevProps, prevState) {
		const { dispatch, params: { day }, plan, subscription, bible } = this.props
		// we need to get the references for the current day
		if (plan && 'id' in plan && subscription && 'id' in subscription && day !== prevProps.day) {
			const currentDay = day ||
			calcCurrentPlanDay({
				total_days: plan.total_days,
				start_dt: subscription.start_dt
			})
			// make the refs call if we don't already have them in state
			const refs = plan.days && plan.days[currentDay - 1] ?
										plan.days[currentDay - 1].references :
										null
			if (refs && (bible && bible.references && !(refs[0] in bible.references))) {
				dispatch(bibleReferences({ refs }))
			}
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

	render() {
		const { children, subscription, plan, params: { day }, bible } = this.props
		console.log(`
			-------------------------------------------------
			PROPS
			-------------------------------------------------
		`, this.props)

		let currentDay = null
		let progressDays = null
		let subscription_id = null
		const together_id = subscription && 'together_id' in subscription ?
												subscription.together_id : null
		if (plan && subscription && subscription.start_dt) {
			subscription_id = subscription.id
			currentDay = day ||
										calcCurrentPlanDay({
											total_days: plan.total_days,
											start_dt: subscription.start_dt
										})
			progressDays = subscription.days ?
											subscription.days :
											null
		}

		return (
			<PlanComponent
				{...this.props}
				localizedLink={::this.localizedLink}
				isRtl={::this.isRtl}
				together_id={together_id}
				day={currentDay}
				progressDays={progressDays}
				subscription_id={subscription ? subscription.id : null}
			>
				{
					children &&
					React.cloneElement(children, {
						localizedLink: ::this.localizedLink,
						isRtl: ::this.isRtl,
						together_id,
						day: currentDay,
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
	return {
		plan: getPlansModel(state) && plan_id in getPlansModel(state).byId ?
					getPlansModel(state).byId[plan_id] :
					null,
		subscription: getSubscriptionModel(state) && subscription_id in getSubscriptionModel(state).byId ?
									getSubscriptionModel(state).byId[subscription_id] :
									null,
		bible: getBibleModel(state),
		savedPlans: state.readingPlans && state.readingPlans.savedPlans ? state.readingPlans.savedPlans : null,
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts
	}
}

export default connect(mapStateToProps, null)(Plan)
