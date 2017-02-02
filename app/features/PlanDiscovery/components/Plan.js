import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import moment from 'moment'

import Image from '../../../components/Carousel/Image'
import PlanDaySlider from './PlanDaySlider'
import PlanDayStatus from './PlanDayStatus'
import PlanDayStartButton from './PlanDayStartButton'
import PlanReferences from './PlanReferences'

class Plan extends Component {
	render() {
		const { plan, children, params, auth, location, localizedLink, serverLanguageTag } = this.props
		const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'
		const subscriptionLink = localizedLink(`/users/${auth.userData.username}/reading-plans/${plan.id}-${plan.slug}`)
		const day = parseInt(location.query.day, 10) || moment().diff(moment(plan.start_dt, 'YYYY-MM-DD'), 'days') + 1
		const dayData = plan.calendar[day - 1]
		const hasDevo = (
			(typeof dayData.additional_content.html !== 'undefined' && dayData.additional_content.html !== null) ||
			(typeof dayData.additional_content.text !== 'undefined' && dayData.additional_content.text !== null)
		)

		let startLink
		if (hasDevo) {
			startLink = { pathname: `${subscriptionLink}/devo`, query: { day } }
		} else {
			startLink = { pathname: `${subscriptionLink}/ref`, query: { day, content: 0 } }
		}

		return (
			<div className="subscription-show">
				<div className="plan-overview">
					<div className="row">
						<div className="header columns large-8 medium-8 medium-centered">
							<div className="back">
								<Link to={`/users/${auth.userData.username}/reading-plans`}>back</Link>
							</div>
							<div className="settings">
								settings
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
					<div className="row days-container collapse">
						<div className="columns large-8 medium-8 medium-centered">
							<PlanDaySlider day={day} calendar={plan.calendar} link={subscriptionLink} />
						</div>
					</div>
					<div className="row">
						<div className="columns large-8 medium-8 medium-centered">
							<div className="start-reading">
								<PlanDayStartButton dayData={dayData} link={startLink} />
							</div>
							<PlanDayStatus day={day} calendar={plan.calendar} total={plan.total_days} />
							<PlanReferences day={day} references={dayData.reference_content} link={subscriptionLink} />
						</div>
					</div>
				</div>

				<Helmet
					title={`${plan.name[language_tag] || plan.name.default} - ${plan.about.text[language_tag] || plan.about.text.default}`}
					meta={[
						{ name: 'description', content: plan.about.text[language_tag] || plan.about.text.default }
					]}
				/>

				<p>Plan View</p><br />
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/edit'}>Settings</Link><br />
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/calendar'}>Calendar</Link><br />
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/devo?day=2'}>Devo</Link><br />
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/ref?content=0&day=2'}>Ref</Link><br />

				<div>
					{children}
				</div>
			</div>
		)
	}
}

Plan.propTypes = {
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