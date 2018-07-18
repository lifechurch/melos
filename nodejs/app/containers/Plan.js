import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import { FormattedHTMLMessage } from 'react-intl'
import rtlDetect from 'rtl-detect'
import moment from 'moment'
import { push } from 'react-router-redux'
// actions
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import subscriptionData, { subscriptionDayUpdate } from '@youversion/api-redux/lib/batchedActions/subscriptionData'
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import bibleAction from '@youversion/api-redux/lib/endpoints/bible/action'
// models
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
// selectors
// utils
import calcTodayVsStartDt from '@youversion/utils/lib/readingPlans/calcTodayVsStartDt'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import calcCurrentPlanDay from '@youversion/utils/lib/readingPlans/calcCurrentPlanDay'
import isFinalSegmentToComplete from '@youversion/utils/lib/readingPlans/isFinalSegmentToComplete'
import isFinalPlanDay from '@youversion/utils/lib/readingPlans/isFinalPlanDay'
import Routes from '@youversion/utils/lib/routes/routes'
// components
import PlanComponent from '../features/PlanDiscovery/components/Plan'
import PlanStartString from '../features/PlanDiscovery/components/PlanStartString'


class Plan extends Component {
	componentDidMount() {
		const { dispatch, params: { subscription_id, id }, bible, auth, subscription, plan, serverLanguageTag } = this.props
		const day = this.currentDay()
		if (subscription_id) {
			if (
				!(
					subscription
					&& plan
					&& Immutable.fromJS(plan).getIn(['days', `${day}`], false)
					&& Immutable.fromJS(subscription).getIn(['days'], false)
				)
			) {
				dispatch(subscriptionData({ subscription_id, auth, day, serverLanguageTag }))
			}
		} else if (!plan) {
			dispatch(planView({
				plan_id: id.split('-')[0],
				serverLanguageTag
			}))
		}
		// get bible version for building reference strings
		const version_id = getBibleVersionFromStorage(serverLanguageTag)
		if (!(bible && bible.versions && bible.versions.byId && version_id in bible.versions.byId)) {
			dispatch(bibleAction({
				method: 'version',
				params: {
					id: version_id,
				}
			}))
		}
	}

	componentWillReceiveProps(nextProps) {
		const { dispatch, plan, subscription } = this.props
		const nextDay = nextProps.params.day && Math.abs(parseInt(nextProps.params.day, 10))
		// either new day from url or no day in url and we calculated the right day
		const dayToCheck = this.currentDay()
		const hasNewDay = dayToCheck
			&& nextDay
			&& dayToCheck !== nextDay
			&& nextDay <= plan.total_days
		let hasCalcNewDay = false
		if (!hasNewDay && plan) {
			hasCalcNewDay = !Immutable.fromJS(plan).hasIn(['days', `${dayToCheck}`], false)
		}
		const dayToGet = (hasNewDay && nextDay) || dayToCheck
		if ((hasNewDay || hasCalcNewDay) && dayToGet) {
			if (plan && 'id' in plan) {
				dispatch(plansAPI.actions.day.get({
					id: plan.id,
					day: dayToGet,
					together: !!(subscription && subscription.together_id),
				}, {})).then(({ data }) => {
					// if this day doesn't have any segments then we want to mark it as complete
					if (
						data
						&& data[plan.id]
						&& data[plan.id][dayToGet]
						&& !data[plan.id][dayToGet].segments
						&& !(this.dayProgress && this.dayProgress.complete)
					) {
						dispatch(subscriptionDayUpdate({
							markDayComplete: true,
							subscription_id: subscription.id,
							day: dayToGet,
						}))
					}
				})
			}
		}
	}

	onCatchUp = () => {
		const { dispatch, auth, subscription } = this.props
		if (subscription && subscription.days) {
			// calculate first uncompleted day to set the new start date
			let newStartDt = null
			Object.keys(subscription.days).some((key, i) => {
				const progressDay = subscription.days[key]
				// start plan however many days are completed away from today
				// i.e. we have 2 days completed and we're behind, let's start the plan
				// 2 days ago
				newStartDt = moment().subtract(i, 'days').toISOString()
				return !progressDay.complete
			})
			if (newStartDt) {
				dispatch(plansAPI.actions.subscription.put({
					id: subscription.id
				}, {
					auth: auth.isLoggedIn,
					body: {
						start_dt: newStartDt
					}
				})).then(() => {
					// refresh progress
					dispatch(plansAPI.actions.progress.get({
						id: subscription.id,
						page: '*',
						fields: 'days'
					}, {
						auth: true
					}))
				})
			}
		}
	}

	OnContentCheck = ({ contentIndex, complete }) => {
		const { params: { subscription_id, id }, dispatch, auth } = this.props

		// no activity on an archived plan
		if (this.isArchived || this.isCompleted) return
		const day = this.currentDay()
		const isFinalDay = isFinalPlanDay(day, this.progressDays)
		const isPlanComplete = complete
			&& isFinalDay
			&& isFinalSegmentToComplete(contentIndex, this.dayProgress.partial)

		dispatch(subscriptionDayUpdate({
			contentIndex,
			complete,
			daySegments: this.daySegments,
			dayProgress: this.dayProgress,
			subscription_id,
			day,
			isPlanComplete,
		})).then(() => {
			// either we're completing a day or just completed the plan and deleted it from
			// state
			if (isPlanComplete || (this.dayProgress.complete)) {
				if (isPlanComplete) {
					dispatch(push(Routes.subscriptionComplete({
						username: auth.userData.username,
						plan_id: id.split('-')[0],
						slug: id.split('-')[1],
					})))
				} else {
					dispatch(push(Routes.subscriptionDayComplete({
						username: auth.userData.username,
						plan_id: id.split('-')[0],
						slug: id.split('-')[1],
						subscription_id,
						day,
					})))
				}
			}
		})
	}

	/**
	 * the current day is either a sanitized url param or a calcCurrentPlanDay()
	 * result (which looks at the the current date against the start date)
	 * @return {String, Number} current plan day
	 */
	currentDay = () => {
		const { params: { day }, plan, subscription } = this.props
		// make sure if we get a day from the url that it is atleast a positive num
		// and then if we have the plan data let's make sure it falls within the total_days
		// for the plan
		let currentDay = day && Math.abs(parseInt(day, 10))
		const invalidDay = !currentDay ||
			(currentDay && plan && plan.total_days && (currentDay > plan.total_days))
		if (invalidDay && plan && subscription && subscription.start_dt) {
			currentDay = calcCurrentPlanDay({
				total_days: plan.total_days,
				start_dt: subscription.start_dt
			})
		}
		return currentDay || 1
	}

	localizedLink = (link) => {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	isRtl = () => {
		const { params, serverLanguageTag } = this.props
		const languageTag = params.lang || serverLanguageTag || 'en'
		return rtlDetect.isRtlLang(languageTag)
	}

	render() {
		const { children, subscription, plan, bible, togethers, serverLanguageTag } = this.props

		this.daySegments = null
		this.dayProgress = null
		this.progressDays = null
		let progressString = null
		let dayOfString = null
		let startString = null
		let endString = null
		let subscription_id = null

		const currentDay = this.currentDay()
		const together_id = subscription
			&& 'together_id' in subscription
			? subscription.together_id
			: null
		this.isArchived = togethers
			&& togethers.byId
			&& together_id in togethers.byId
			&& togethers.byId[together_id].archived

		if (plan && subscription && subscription.start_dt) {
			subscription_id = subscription.id
			dayOfString = (
				<FormattedHTMLMessage
					id='plans.which day in plan'
					values={{
						day: this.currentDay(),
						total: plan.total_days
					}}
				/>
			)
			startString = moment(subscription.start_dt).format('dddd, MMMM Do YYYY')
			endString = moment(subscription.start_dt)
				.add(plan.total_days, 'days')
				.format('dddd, MMMM Do YYYY')
			this.isCompleted = !!subscription.completed_dt
			this.progressDays = subscription.days
				? subscription.days
				: null
			this.dayProgress = this.progressDays && this.progressDays[currentDay]
				? this.progressDays[currentDay]
				: null
			if (this.isCompleted) {
				progressString = moment(subscription.completed_dt).format('LL')
			} else if (calcTodayVsStartDt(subscription.start_dt).isInFuture) {
				progressString = <PlanStartString start_dt={subscription.start_dt} />
			} else {
				progressString = subscription.overall
					? subscription.overall.progress_string
					: null
			}
		}

		this.daySegments = plan
			&& plan.days
			&& plan.days[currentDay]
			? plan.days[currentDay].segments
			: null

		const bookList = Immutable
			.fromJS(bible)
			.getIn(['versions', 'byId', `${getBibleVersionFromStorage(serverLanguageTag)}`, 'response', 'books'], null)

		return (
			<PlanComponent
				{...this.props}
				localizedLink={this.localizedLink}
				isRtl={this.isRtl}
				together_id={together_id}
				day={currentDay}
				progressDays={this.progressDays}
				dayProgress={this.dayProgress}
				daySegments={this.daySegments}
				progressString={progressString}
				bookList={bookList ? bookList.toJS() : null}
				start_dt={subscription ? subscription.start_dt : null}
				subscription_id={subscription ? subscription.id : null}
				isCompleted={this.isCompleted}
				handleContentCheck={
					!this.isArchived
						&& !this.isCompleted
						&& this.OnContentCheck
				}
				handleCatchUp={this.onCatchUp}
			>
				{
					children
						&& (children.length > 0 || !Array.isArray(children))
						&& React.cloneElement(children, {
							localizedLink: this.localizedLink,
							isRtl: this.isRtl,
							together_id,
							day: currentDay,
							progressDays: this.progressDays,
							subscription_id,
							dayOfString,
							startString,
							endString,
							onCatchUp: this.onCatchUp,
						})
				}
			</PlanComponent>
		)
	}
}

function mapStateToProps(state, props) {
	const { params: { id, subscription_id } } = props
	const plan_id = id.split('-')[0]
	return {
		plan: getPlansModel(state) && plan_id in getPlansModel(state).byId
			? getPlansModel(state).byId[plan_id]
			: null,
		subscription: getSubscriptionModel(state) && subscription_id in getSubscriptionModel(state).byId
			? getSubscriptionModel(state).byId[subscription_id]
			: null,
		bible: getBibleModel(state),
		togethers: getTogetherModel(state),
		savedPlans: state.readingPlans && state.readingPlans.savedPlans ? state.readingPlans.savedPlans : null,
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts
	}
}

Plan.propTypes = {
	children: PropTypes.object.isRequired,
	subscription: PropTypes.object.isRequired,
	plan: PropTypes.object.isRequired,
	bible: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	togethers: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
}

export default connect(mapStateToProps, null)(Plan)
