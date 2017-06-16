import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { routeActions } from 'react-router-redux'
import Immutable from 'immutable'
// actions

// components
import LazyImage from '../../../components/LazyImage'
import PlanMenu from './PlanMenu'
import ShareWidget from './ShareWidget'
// utils
import isFinalReadingForDay, {
	isFinalPlanDay,
	dayHasDevo,
	handleRefUpdate
} from '../../../lib/readingPlanUtils'
import { getBibleVersionFromStorage } from '../../../lib/readerUtils'
import { PLAN_DEFAULT, selectImageFromList } from '../../../lib/imageUtil'
import Routes from '../../../lib/routes'


class Plan extends Component {

	handleCompleteRef = (day, ref, complete) => {
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
		const {
			plan,
			day,
			start_dt,
			progressDays,
			references,
			savedPlans,
			dispatch,
			children,
			params,
			auth,
			localizedLink,
			isRtl,
			serverLanguageTag,
			together_id,
			subscription_id,
			handleCatchUp,
		} = this.props

		const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'
		const isSaved = !!((savedPlans && Array.isArray(savedPlans.all) && savedPlans.all.indexOf(plan.id) !== -1))

		let aboutLink,
			myPlansLink,
			bibleLink,
			planLinkNode,
			subscriptionLink,
			startLink,
			planTitle,
			planImgSrc,
			isPrivate,
			isEmailDeliveryOn,
			emailDelivery,
			plan_id,
			totalDays

		if (plan && plan.id) {
			// build some links
			aboutLink = localizedLink(`/reading-plans/${plan.id}-${plan.slug}`)
			myPlansLink = localizedLink(`/users/${auth.userData.username}/reading-plans`)
			bibleLink = localizedLink(`/bible/${getBibleVersionFromStorage()}`)
			planLinkNode = <Link to={`${aboutLink}/day/1`}><FormattedMessage id='plans.sample' /></Link>
			subscriptionLink = Routes.subscription({
				username: auth.userData.username,
				plan_id: plan.id,
				slug: plan.slug,
				subscription_id,
			})
			startLink = Routes.subscriptionRef({
				username: auth.userData.username,
				plan_id: plan.id,
				slug: plan.slug,
				subscription_id,
				day,
				content: 0,
			})

			// get other plan info
			planTitle = plan.name[language_tag] || plan.name.default
			planImgSrc = selectImageFromList({
				images: plan.images,
				width: 640,
				height: 320
			}).url
			plan_id = plan.id
			totalDays = plan.total_days
			isPrivate = plan.private
			isEmailDeliveryOn = (typeof plan.email_delivery === 'string')
			emailDelivery = plan.email_delivery
		}


		return (
			<div className='subscription-show'>
				<div className='plan-overview'>
					<div className='row'>
						<div className='header columns large-8 medium-8 medium-centered'>
							<Link to={`/users/${auth.userData.username}/reading-plans`}>
								<FormattedHTMLMessage id='plans.plans back' />
							</Link>
							<div className='actions'>
								<PlanMenu
									subscriptionLink={subscriptionLink}
									aboutLink={aboutLink}
									onCatchUp={handleCatchUp}
								/>
								<div><ShareWidget /></div>
							</div>
						</div>
					</div>
					<div className='row collapse'>
						<div className='horizontal-center' style={{ height: '170', marginBottom: '30px' }}>
							<LazyImage
								alt='plan-image'
								src={planImgSrc}
								width={300}
								height={170}
								placeholder={<img alt='plan' src={PLAN_DEFAULT} />}
							/>
						</div>
					</div>
					<div className='row'>
						<div className='medium-centered text-center columns'>
							<h3 className='plan-title'>{ planTitle }</h3>
						</div>
					</div>
					{
						children &&
						React.cloneElement(children, {
							id: plan_id,
							plan,
							dispatch,
							auth,
							day,
							progressDays,
							actionsNode: <div />,
							planLinkNode,
							isSubscribed: !!subscription_id,
							totalDays,
							subscriptionLink,
							aboutLink,
							startLink,
							bibleLink,
							myPlansLink,
							language_tag: serverLanguageTag,
							isRtl,
							isSaved,
							isPrivate,
							isEmailDeliveryOn,
							emailDelivery,
							together_id,
							handleCompleteRef: this.handleCompleteRef
						})
					}
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
