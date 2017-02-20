import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import moment from 'moment'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import cookie from 'react-cookie'
import Immutable from 'immutable'

import Image from '../../../components/Carousel/Image'
import PlanMenu from './PlanMenu'
import ShareWidget from './ShareWidget'
import ActionCreators from '../actions/creators'

function dayHasDevo(devoContent) {
	return (typeof devoContent.html !== 'undefined' && devoContent.html !== null) ||
		(typeof devoContent.text !== 'undefined' && devoContent.text !== null)
}

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
		const { dispatch, plan: { calendar, id } } = this.props
		const dayData = calendar[day - 1]
		const references = Immutable.fromJS(dayData.references_completed).toJS()
		const hasDevo = dayHasDevo(dayData.additional_content)

		// devotional is true by default if there is no devotional
		// otherwise this will overwrite with the correct value
		let completeDevo = true
		if (ref === 'devo') {
			completeDevo = complete
		} else if (hasDevo) {
			completeDevo = dayData.additional_content.completed
		}

		// if we have a reference, that we're reading through,
		// add it to the list of completedRefs
		if (ref && ref !== 'devo') {
			if (complete === true) {
				references.push(ref)
			} else {
				references.splice(references.indexOf(ref), 1)
			}
		}

		// make api call
		dispatch(ActionCreators.updateCompletion({
			id,
			day,
			references,
			devotional: completeDevo,
		}, true))
	}

	render() {
		const { plan, dispatch, children, dayBaseLink, params, auth, location, localizedLink, serverLanguageTag } = this.props
		const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'
		const version = cookie.load('version') || '1'
		const aboutLink = dayBaseLink || localizedLink(`/reading-plans/${plan.id}-${plan.slug}`)
		const myPlansLink = localizedLink(`/users/${auth.userData.username}/reading-plans`)
		const bibleLink = localizedLink(`/bible/${version}`)
		const isSaved = !!plan.saved === true

		// This component can be reached two ways, Plan Subscription and Plan Sample
		//  Depending on how we get here, we need to parse the initial variable values
		//  differently.
		let day, mode, metaTitle, metaDesc, subscriptionLink

		if ('day' in params) {
			// Got Here via Plan Sample
			mode = 'sample'
			metaTitle = `${plan.name[language_tag] || plan.name.default} - ${plan.about.text[language_tag] || plan.about.text.default}`
			metaDesc = `${plan.about.text[language_tag] || plan.about.text.default}`
			day = parseInt(params.day.toString(), 10)
			subscriptionLink = aboutLink

		} else {
			// Got Here via Plan Subscription
			mode = 'subscription'
			subscriptionLink = localizedLink(`${myPlansLink}/${plan.id}-${plan.slug}`)
			day = parseInt(location.query.day, 10)

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
		}

		const dayData = plan.calendar[day - 1]
		const devoCompleted = (mode === 'subscription') ? dayData.additional_content.completed === true : false
		const hasDevo = dayHasDevo(dayData.additional_content)

		let startLink = ''
		if (mode === 'subscription') {
			if (hasDevo) {
				startLink = { pathname: `${subscriptionLink}/devo`, query: { day } }
			} else {
				startLink = { pathname: `${subscriptionLink}/ref`, query: { day, content: 0 } }
			}
		}

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
							<div className="row">
								<div className="columns medium-4">
									<Link to={`/users/${auth.userData.username}/reading-plans`}>
										<FormattedHTMLMessage id="plans.plans back" />
									</Link>
								</div>

								<div className="columns medium-4 text-center" style={{ fontSize: 11 }}>
									{mode === 'sample'
										? <FormattedMessage id="plans.sample" />
										: <span>&nbsp;</span>
									}
								</div>
								<div className="columns medium-4 text-right">
									<div><ShareWidget /></div>
									{(mode === 'subscription') &&
										<PlanMenu
											subscriptionLink={subscriptionLink}
											aboutLink={aboutLink}
											onCatchUp={this.handleCatchUp}
										/>
									}
								</div>
							</div>
						</div>
					</div>
					<div className="row collapse">
						<div className="columns medium-centered text-center img">
							<Image className="rp-hero-img" width={640} height={360} thumbnail={false} imageId="false" type="about_plan" config={plan} />
						</div>
					</div>
					<div className="row">
						<div className="medium-centered text-center">
							<h3 className="plan-title">{ plan.name[language_tag] || plan.name.default }</h3>
						</div>
					</div>
					{children && React.cloneElement(children, {
						id: plan.id,
						plan,
						dispatch,
						auth,
						mode,
						day,
						dayData,
						calendar: plan.calendar,
						totalDays: plan.total_days,
						subscriptionLink,
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
	serverLanguageTag: PropTypes.string
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
