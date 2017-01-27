import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import Image from '../../../components/Carousel/Image'
import moment from 'moment'
import PlanDaySlider from './PlanDaySlider'

class Plan extends Component {
	render() {
		const { plan, children, params, auth, location, localizedLink, serverLanguageTag } = this.props
		const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'
		const subscriptionLink = localizedLink(`/users/${auth.userData.username}/reading-plans/${plan.id}-${plan.slug}`)
		const day = location.query.day || 1
		const dayData = plan.calendar[day - 1]
console.log("plan", plan)
		const references = dayData.references.map((r) => {
			return <li key={r} className="li-right">{r}</li>
		})

		return (
			<div className="subscription-show">
				<div className="plan-overview">
					<div className="row">
						<div className="header columns large-8 medium-8 medium-centered">
							<div className="back">
								back
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
							<PlanDaySlider day={day} plan={plan} link={subscriptionLink} />
						</div>
 					</div>
 					<div className="row">
 						<div className="columns large-8 medium-8 medium-centered">
 							<div className="start-reading">
 								<Link to={`/bob`} className="solid-button green"><FormattedMessage id="plans.widget.start reading" /></Link>
 							</div>
							<p>
								<FormattedHTMLMessage id="plans.which day in plan" values={{ day: day, total: plan.total_days }} />
								&nbsp;&bull;&nbsp;
								<FormattedMessage id="plans.status.missed days.one" values={{ count: 1 }} />
							</p>
							<ul className="no-bullets plan-pieces">
								{references}
							</ul>
 						</div>
 					</div>
				</div>

				<Helmet
					title={`${plan.name[language_tag] || plan.name.default} - ${plan.about.text[language_tag] || plan.about.text.default}`}
					meta={[
						{ name: 'description', content: plan.about.text[language_tag] || plan.about.text.default }
					]}
				/>


				<p>Plan View</p><br/>
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/edit'}>Settings</Link><br/>
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/calendar'}>Calendar</Link><br/>
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/devo'}>Devo</Link><br/>
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/ref'}>Ref</Link><br/>

				<div>
					{children}
				</div>
			</div>
		)
	}
}

Plan.propTypes = {

}

Plan.defaultProps = {

}

export default Plan