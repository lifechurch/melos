import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import moment from 'moment'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { routeActions } from 'react-router-redux'
import cookie from 'react-cookie'
import Immutable from 'immutable'

import Image from '../../../components/Carousel/Image'
import PlanMenu from './PlanMenu'
import ShareWidget from './ShareWidget'
import ActionCreators from '../actions/creators'
import isFinalReadingForDay, { isFinalPlanDay, dayHasDevo, handleRefUpdate } from '../../../lib/readingPlanUtils'


class Plan extends Component {
	constructor(props) {
		super(props)

		this.handleCatchUp = this.handleCatchUp.bind(this)
		this.handleCompleteRef = this.handleCompleteRef.bind(this)
	}

	handleCatchUp() {
		const {
			dispatch,
			params,
			plan: {
				id
			},
			serverLanguageTag,
			auth: {
				userData: {
					userid: user_id,
					language_tag: userLanguageTag
				}
			},
			location: {
				query
			}
		} = this.props

		const day = parseInt(query.day, 10)
		const language_tag = serverLanguageTag || params.lang || userLanguageTag || 'en'
		const version = cookie.load('version') || '1'

		if (id) {
			dispatch(ActionCreators.resetSubscriptionAll({ id, language_tag, user_id, day, version }, true))
		}
	}

	handleCompleteRef(day, ref, complete) {
		const { dispatch, plan: { calendar, id, total_days } } = this.props
		const dayData = calendar[day - 1]
		const references = Immutable.fromJS(dayData.references_completed).toJS()
		const hasDevo = dayHasDevo(dayData.additional_content)

		handleRefUpdate(
			references,
			ref === 'devo',
			hasDevo,
			ref === 'devo' ? complete : dayData.additional_content.completed,
			ref !== 'devo' ? ref : null,
			complete,
			id,
			day,
			dispatch
		)

		// push day complete/plan complete
		if (complete) {
			if (isFinalReadingForDay(dayData, ref, ref === 'devo')) {
				if (isFinalPlanDay(day, calendar, total_days)) {
					dispatch(routeActions.push(`${window.location.pathname.replace(`/day/${day}`)}/completed`))
				} else {
					dispatch(routeActions.push(`${window.location.pathname}/completed`))
				}
			}
		}
	}

	render() {
		const { plan, savedPlans, dispatch, children, params, auth, localizedLink, serverLanguageTag } = this.props
		const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'
		const version = cookie.load('version') || '1'
		const aboutLink = localizedLink(`/reading-plans/${plan.id}-${plan.slug}`)
		const myPlansLink = localizedLink(`/users/${auth.userData.username}/reading-plans`)
		const bibleLink = localizedLink(`/bible/${version}`)
		const isSaved = !!((savedPlans && Array.isArray(savedPlans.all) && savedPlans.all.indexOf(plan.id) !== -1))

		const planLinkNode = <Link to={`${aboutLink}/day/1`}><FormattedMessage id="plans.sample" /></Link>

		let day = parseInt(params.day, 10)
		// if day is not valid, calculate based on start_dt
		if (!day || isNaN(day)) {
			const calculatedDay = moment().diff(moment(plan.start_dt, 'YYYY-MM-DD'), 'days') + 1
			if (isNaN(calculatedDay)) {
				day = 1
			} else if (calculatedDay > plan.total_days) {
				day = plan.total_days
			} else {
				day = calculatedDay
			}
		}

		const subscriptionLink = localizedLink(`${myPlansLink}/${plan.id}-${plan.slug}`)
		const dayBaseLink = localizedLink(`${myPlansLink}/${plan.id}-${plan.slug}`)
		const dayData = plan.calendar[day - 1]
		const devoCompleted = dayData.additional_content.completed
		const hasDevo = dayHasDevo(dayData.additional_content)

		let startLink = ''
		if (hasDevo) {
			startLink = `${subscriptionLink}/day/${day}/devo`
		} else {
			startLink = `${subscriptionLink}/day/${day}/ref/0`
		}

		const metaTitle = `${plan.name[language_tag] || plan.name.default} - ${plan.about.text[language_tag] || plan.about.text.default}`
		const metaDesc = `${plan.about.text[language_tag] || plan.about.text.default}`

		return (
			<div className="subscription-show">
				<Helmet
					title={metaTitle}
					meta={[
						{ name: 'description', content: metaDesc }
					]}
				/>
				<div className="plan-overview">
					<div className="row">
						<div className="header columns large-8 medium-8 medium-centered">
							<Link to={`/users/${auth.userData.username}/reading-plans`}>
								<FormattedHTMLMessage id="plans.plans back" />
							</Link>
							<div className="actions">
								<PlanMenu
									subscriptionLink={subscriptionLink}
									aboutLink={aboutLink}
									onCatchUp={this.handleCatchUp}
								/>
								<div><ShareWidget /></div>
							</div>
						</div>
					</div>
					<div className="row collapse">
						<div className="columns medium-centered text-center img">
							<Image className="rp-hero-img" width={640} height={360} thumbnail={false} imageId="false" type="about_plan" config={plan} />
						</div>
					</div>
					<div className="row">
						<div className="medium-centered text-center columns">
							<h3 className="plan-title">{ plan.name[language_tag] || plan.name.default }</h3>
						</div>
					</div>
					{children && React.cloneElement(children, {
						id: plan.id,
						plan,
						dispatch,
						auth,
						day,
						dayData,
						actionsNode: <div />,
						planLinkNode,
						isSubscribed: ('subscription_id' in plan),
						calendar: plan.calendar,
						totalDays: plan.total_days,
						subscriptionLink,
						dayBaseLink,
						aboutLink,
						startLink,
						bibleLink,
						myPlansLink,
						devoCompleted,
						hasDevo,
						isSaved,
						isPrivate: plan.private,
						isEmailDeliveryOn: (typeof plan.email_delivery === 'string'),
						emailDelivery: plan.email_delivery,
						handleCompleteRef: this.handleCompleteRef
					})}
				</div>
			</div>
		)
	}
}

Plan.propTypes = {
	dispatch: PropTypes.func.isRequired,
	plan: PropTypes.object,
	params: PropTypes.object,
	children: PropTypes.object,
	auth: PropTypes.object,
	location: PropTypes.object,
	localizedLink: PropTypes.func,
	serverLanguageTag: PropTypes.string,
	savedPlans: PropTypes.object.isRequired
}

Plan.defaultProps = {
	plan: {},
	params: {},
	children: {},
	auth: {},
	location: {},
	localizedLink: (param) => { return param },
	serverLanguageTag: ''
}

export default Plan
