import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import Routes from '@youversion/utils/lib/routes/routes'
import List from '../components/List'
import ParticipantsAvatarList from '../widgets/ParticipantsAvatarList'
import PlanListItem from '../features/PlanDiscovery/components/PlanListItem'


class CompletedList extends Component {

	componentDidMount() {
		const { auth } = this.props
		this.username = (auth && auth.userData && auth.userData.username) ? auth.userData.username : null
		this.getCompletedSubs()
	}

	getCompletedSubs = (page = 1) => {
		const { auth, dispatch, serverLanguageTag } = this.props
		if (page) {
			dispatch(plansAPI.actions.subscriptions.get({
				status: 'completed',
				order: 'desc',
				page,
			}, { auth: true })).then((subs) => {
				if (subs && subs.data) {
					const ids = Object.keys(subs.data)
					if (ids.length > 0) {
						ids.forEach((id) => {
							const sub = subs.data[id]
							dispatch(planView({
								plan_id: sub.plan_id,
								together_id: sub.together_id,
								auth,
								serverLanguageTag
							}))
						})
					}
				}
			})
		}
	}

	renderListItem = ({ plan_id, together_id, completed_dt, subscription_id = null }) => {
		const {
			language_tag,
			readingPlans,
			localizedLink
		} = this.props
		const plan = (plan_id && plan_id in readingPlans.byId) ? readingPlans.byId[plan_id] : null

		let link, src, subContent
		if (plan && 'id' in plan) {
			src = plan.images
				? selectImageFromList({
					images: plan.images,
					width: 160,
					height: 160
				}).url
				: null
			if (together_id) {
				link = localizedLink(
					Routes.subscription({
						username: this.username,
						plan_id: plan.id,
						slug: plan.slug,
						subscription_id,
					})
				)
			} else {
				link = localizedLink(
					Routes.plan({
						plan_id: plan.id,
						slug: plan.slug
					}))
			}

			subContent = (
				<div>
					<div className='plan-length'>
						{
							plan.formatted_length[language_tag] ||
							plan.formatted_length.default
						}
					</div>
					{
						together_id
							&& (
								<ParticipantsAvatarList
									together_id={together_id}
									plan_id={plan_id}
									avatarWidth={26}
									statusFilter={['accepted', 'host']}
								/>
							)
					}
					<div className='plan-completed'>
						{ moment(completed_dt).format('LL') }
					</div>
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
		const { subscriptions } = this.props

		const plansList = []
		const completed = subscriptions.getCompleted()
		if (completed && completed.length > 0) {
			completed.forEach((sub) => {
				if (sub && sub.plan_id) {
					plansList.push(this.renderListItem({
						plan_id: sub.plan_id,
						together_id: sub.together_id,
						completed_dt: sub.completed_dt,
						subscription_id: sub.id,
					}))
				}
				return null
			})
		}

		return (
			<List customClass='subscription-list' loadMore={this.getCompletedSubs.bind(this, subscriptions.next_page)}>
				{
					plansList.length > 0
						? plansList
						: <FormattedMessage id='features.EventEdit.errors.noMatchingPlans' />
				}
			</List>
		)
	}
}

function mapStateToProps(state) {
	return {
		subscriptions: getSubscriptionsModel(state),
		readingPlans: getPlansModel(state),
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag
	}
}

CompletedList.propTypes = {
	subscriptions: PropTypes.object.isRequired,
	readingPlans: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	language_tag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	localizedLink: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired
}

export default connect(mapStateToProps, null)(CompletedList)
