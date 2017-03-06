import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import cookie from 'react-cookie'

import { getSelectionString } from '../../../lib/usfmUtils'
import Image from '../../../components/Carousel/Image'
import ShareWidget from './ShareWidget'
import PlanDevo from './planReader/PlanDevo'


function dayHasDevo(devoContent) {
	return (typeof devoContent.html !== 'undefined' && devoContent.html !== null) ||
		(typeof devoContent.text !== 'undefined' && devoContent.text !== null)
}

class UnsubbedPlan extends Component {

	render() {
		const { plan, dispatch, children, dayBasePath, actionsNode, allplansNode, params, auth, localizedLink, serverLanguageTag } = this.props
		const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'
		const version = cookie.load('version') || '1'
		const aboutLink = localizedLink(`/reading-plans/${plan.id}-${plan.slug}`)
		const myPlansLink = localizedLink(`/users/${auth.userData.username}/reading-plans`)
		const bibleLink = localizedLink(`/bible/${version}`)
		const isSaved = !!plan.saved === true
		const daySliderBasePath = dayBasePath || localizedLink(`/reading-plans/${plan.id}-${plan.slug}`)

		const metaTitle = `${plan.name[language_tag] || plan.name.default} - ${plan.about.text[language_tag] || plan.about.text.default}`
		const metaDesc = `${plan.about.text[language_tag] || plan.about.text.default}`
		const day = parseInt(params.day.toString(), 10)
		const subscriptionLink = aboutLink

		const planLinkNode = <Link to={`${aboutLink}`}><FormattedMessage id="plans.about this plan" /></Link>

		const dayData = plan.calendar[day - 1]
		const hasDevo = dayHasDevo(dayData.additional_content)


		const referenceLinks = Object.keys(dayData.reference_content).map((refIndex) => {
			const reference = dayData.reference_content[refIndex].reference
			let itemBibleLink
			if (reference.usfm[0].split('.').length === 2) {
				// Two pieces indicates full chapter
				itemBibleLink = reference.usfm[0]
			} else {
				// Three pieces indicates verses
				itemBibleLink = `${bibleLink}/${reference.usfm[0].split('.').slice(0, 2).join('.')}.${getSelectionString(reference.usfm)}`
			}
			return (
				<li key={reference.usfm} className="li-right">
					<a tabIndex={0} href={itemBibleLink}>{reference.human}</a>
				</li>
			)
		})
		const refList = (
			<ul className="plan-pieces">
				{referenceLinks}
			</ul>
		)

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
									{
										allplansNode ||
										<Link to={'/reading-plans'}>
											<FormattedHTMLMessage id="plans.plans back" />
										</Link>
									}
								</div>
								<div className="columns medium-4 text-center" style={{ fontSize: 11 }}>
									<FormattedMessage id="plans.sample" />
								</div>
								<div className="columns medium-4 text-right">
									<div><ShareWidget /></div>
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
						planLinkNode,
						actionsNode,
						refListNode: refList,
						calendar: plan.calendar,
						totalDays: plan.total_days,
						isSubscribed: ('subscription_id' in plan),
						dayBaseLink: daySliderBasePath,
						subscriptionLink,
						aboutLink,
						bibleLink,
						myPlansLink,
						hasDevo,
						isSaved,
						isPrivate: plan.private,
						isEmailDeliveryOn: (typeof plan.email_delivery === 'string'),
						emailDelivery: plan.email_delivery,
						handleCompleteRef: this.handleCompleteRef
					})}
					<div className='columns large-8 medium-centered' style={{ marginTop: '100px' }}>
						<PlanDevo
							devoContent={dayData.additional_content.html ?
								dayData.additional_content.html.default :
								dayData.additional_content.text.default}
						/>
					</div>
				</div>
			</div>
		)
	}
}

UnsubbedPlan.propTypes = {
	dispatch: PropTypes.func.isRequired,
	plan: PropTypes.object,
	params: PropTypes.object,
	children: PropTypes.object,
	auth: PropTypes.object,
	localizedLink: PropTypes.func,
	serverLanguageTag: PropTypes.string
}

UnsubbedPlan.defaultProps = {
	plan: {},
	params: {},
	children: {},
	auth: {},
	localizedLink: (param) => { return param },
	serverLanguageTag: ''
}

export default UnsubbedPlan
