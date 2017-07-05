import React, { Component, PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import Waypoint from 'react-waypoint'
import { Link } from 'react-router'
import moment from 'moment'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import participantsView from '@youversion/api-redux/lib/batchedActions/participantsUsersView'
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getTogetherInvitations } from '@youversion/api-redux/lib/models'
import { selectImageFromList } from '../../../lib/imageUtil'
import Routes from '../../../lib/routes'
import List from '../../../components/List'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'
import TogetherInvitationActions from '../../../widgets/TogetherInvitationActions'
import ProgressBar from '../../../components/ProgressBar'
import PlanStartString from '../components/PlanStartString'
import PlanListItem from './PlanListItem'


class PlanList extends Component {

	handleLoadMore = () => {
		const { plans: { nextPage }, loadMore } = this.props
		if (nextPage !== null && typeof loadMore === 'function') {
			loadMore(nextPage)
		}
	}

	renderListItem = ({ plan_id, together_id, start_dt, subscription_id = null }) => {
		const {
			serverLanguageTag,
			readingPlans,
			invitations,
			params,
			auth,
			route: {
				view
			},
			localizedLink
		} = this.props
		const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'
		const plan = (plan_id && plan_id in readingPlans.byId) ? readingPlans.byId[plan_id] : null

		let link, src, subContent, dayString
		if (start_dt && plan && 'id' in plan) {
			src = plan.images ?
						selectImageFromList({ images: plan.images, width: 160, height: 160 }).url :
						null
			// plans together have different day strings
			if (together_id) {
				if (invitations.indexOf(together_id) > -1) {
					dayString = <PlanStartString start_dt={start_dt} />
				}
			} else {
				let day = moment().diff(moment(start_dt, 'YYYY-MM-DD'), 'days') + 1
				if (day > plan.total_days) {
					day = plan.total_days
				}
				dayString = (
					<FormattedMessage
						id='plans.which day in plan'
						values={{ day, total: plan.total_days }}
					/>
				)
			}

			link = localizedLink(Routes.plans({}))
			// if this is a subscription, link to it
			if (subscription_id) {
				link = localizedLink(
					Routes.subscription({
						username: this.username,
						plan_id: plan.id,
						slug: plan.slug,
						subscription_id,
					}))
			// otherwise it's an invitation where we want more info
			} else {
				link = localizedLink(
					Routes.plan({
						plan_id: plan.id,
						slug: plan.slug
					}))
			}

			subContent = (
				<div>
					<ParticipantsAvatarList together_id={together_id} showMoreLink={''} />
					<ProgressBar percentComplete={0} />
					{ dayString }
				</div>
			)
		}

		return (
			<PlanListItem
				key={`${plan_id}.${subscription_id}`}
				src={src}
				name={(plan && 'name' in plan) ? (plan.name[language_tag] || plan.name.default) : null}
				link={link}
				subContent={subContent}
			/>
		)
	}

	render() {
		const { planIds, localizedLink } = this.props


		return (
			<List>
				{
					planIds.map((id) => {

					})
				}
			</List>
		)
	}
}

PlanList.propTypes = {
	plans: PropTypes.array.isRequired,
	loadMore: PropTypes.func,
	title: PropTypes.node
}

PlanList.defaultProps = {
	plans: [],
}

export default injectIntl(PlanList)
