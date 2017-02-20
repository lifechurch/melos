import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import moment from 'moment'
import { FormattedHTMLMessage } from 'react-intl'
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
		const { plan, children, params, auth, location, localizedLink, serverLanguageTag } = this.props
		const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'
		const subscriptionLink = localizedLink(`/users/${auth.userData.username}/reading-plans/${plan.id}-${plan.slug}`)
		const aboutLink = localizedLink(`/reading-plans/${plan.id}-${plan.slug}`)
		let day = parseInt(location.query.day, 10)
		if (!day || isNaN(day)) {
			const calculatedDay = moment().diff(moment(plan.start_dt, 'YYYY-MM-DD'), 'days') + 1
			if (calculatedDay > plan.total_days) {
				day = plan.total_days
			} else {
				day = calculatedDay
			}
		}
		const dayData = plan.calendar[day - 1]
		const devoCompleted = dayData.additional_content.completed === true
		const hasDevo = dayHasDevo(dayData.additional_content)

		let startLink
		if (hasDevo) {
			startLink = { pathname: `${subscriptionLink}/devo`, query: { day } }
		} else {
			startLink = { pathname: `${subscriptionLink}/ref`, query: { day, content: 0 } }
		}

		return (
			<div className="subscription-show">
				<Helmet
					title={`${plan.name[language_tag] || plan.name.default} - ${plan.about.text[language_tag] || plan.about.text.default}`}
					meta={[
						{ name: 'description', content: plan.about.text[language_tag] || plan.about.text.default }
					]}
				/>
				<div className="plan-overview">
					<div className="row">
						<div className="header columns large-8 medium-8 medium-centered">
							<div className="back">
								<Link to={`/users/${auth.userData.username}/reading-plans`}>
									<FormattedHTMLMessage id="plans.plans back" />
								</Link>
							</div>
							<div className="settings">
								<div style={{ float: 'left' }}><ShareWidget /></div>
								<PlanMenu subscriptionLink={subscriptionLink} aboutLink={aboutLink} onCatchUp={this.handleCatchUp} />
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
					{children && React.cloneElement(children, { day, dayData, calendar: plan.calendar, totalDays: plan.total_days, subscriptionLink, startLink, devoCompleted, hasDevo, handleCompleteRef: this.handleCompleteRef })}
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
	localizedLink: () => {},
	serverLanguageTag: ''
}

export default Plan
