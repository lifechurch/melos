import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getTogetherInvitations } from '@youversion/api-redux/lib/models'
import { selectImageFromList } from '../lib/imageUtil'
import Routes from '../lib/routes'
import List from '../components/List'
import ParticipantsAvatarList from '../widgets/ParticipantsAvatarList'
import TogetherInvitationActions from '../widgets/TogetherInvitationActions'
import ProgressBar from '../components/ProgressBar'
import PlanStartString from '../features/PlanDiscovery/components/PlanStartString'
import PlanListItem from '../features/PlanDiscovery/components/PlanListItem'


class SubscriptionList extends Component {

	componentDidMount() {
		const { auth, invitations, subscriptions } = this.props
		this.username = (auth && auth.userData && auth.userData.username) ? auth.userData.username : null
		// get any invites we have
		if (!invitations) {
			this.getInvitations()
		}
		// get actual subscriptions
		if (!(subscriptions && subscriptions.map && subscriptions.map.length > 0)) {
			this.getSubs({ page: 1 })
		}
	}

	getSubs = ({ page = null }) => {
		const { dispatch, auth, serverLanguageTag } = this.props
		dispatch(plansAPI.actions.subscriptions.get({ order: 'desc', page }, { auth: true })).then((subs) => {
			if (subs && subs.data) {
				const ids = Object.keys(subs.data)
				if (ids.length > 0) {
					ids.forEach((id) => {
						const sub = subs.data[id]
						dispatch(planView({
							plan_id: sub.plan_id,
							together_id: sub.together_id,
							user_id: auth && auth.isLoggedIn && auth.userData.userid,
							language_tag: serverLanguageTag,
						}))
					})
				}
			}
		})
	}

	getInvitations = () => {
		const { dispatch, auth, serverLanguageTag } = this.props
		dispatch(plansAPI.actions.togethers.get({ status: 'invited' }, { auth: true })).then((subs) => {
			if (subs && subs.data) {
				const ids = Object.keys(subs.data)
				if (ids.length > 0) {
					ids.forEach((id) => {
						const sub = subs.data[id]
						dispatch(planView({
							plan_id: sub.plan_id,
							together_id: id,
							user_id: auth && auth.isLoggedIn && auth.userData.userid,
							language_tag: serverLanguageTag,
						}))
					})
				}
			}
		})
	}

	loadMore = () => {
		const { subscriptions } = this.props
		if (subscriptions && subscriptions.next_page) {
			this.getSubs({ page: subscriptions.next_page })
		}
	}

	renderListItem = ({ plan_id, together_id, start_dt, subscription_id = null }) => {
		const {
			language_tag,
			readingPlans,
			invitations,
			localizedLink
		} = this.props
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
					Routes.togetherInvitation({
						plan_id: plan.id,
						slug: plan.slug,
						together_id,
					}))
			}

			subContent = (
				<div>
					<ParticipantsAvatarList
						together_id={together_id}
						// if it's an invitation, we want to show all participants
						// otherwise, let's just show accetped and host
						statusFilter={subscription_id ? ['accepted', 'host'] : null}
					/>
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
		const { subscriptions, together, invitations } = this.props

		const plansList = []
		// build list of invitations
		if (invitations && together && together.allIds.length > 0) {
			invitations.forEach((id) => {
				const resource = together.byId[id]
				if (resource && resource.plan_id) {
					plansList.push(
						<div key={`${id}.${resource.plan_id}`}>
							{
								this.renderListItem({
									plan_id: resource.plan_id,
									together_id: id,
									start_dt: resource.start_dt,
								})
							}
							<TogetherInvitationActions
								together_id={id}
								handleActionComplete={() => {
									this.getInvitations()
									this.getSubs({ page: 1 })
								}}
							/>
						</div>
					)
				}
			})
		}
		// build list of subscriptions
		if (subscriptions && subscriptions.allIds.length > 0) {
			subscriptions.allIds.forEach((id) => {
				const sub = subscriptions.byId[id]
				if (sub && sub.plan_id) {
					plansList.push(this.renderListItem({
						plan_id: sub.plan_id,
						together_id: sub.together_id,
						start_dt: sub.start_dt,
						subscription_id: id,
					}))
				}
				return null
			})
		}

		return (
			<List customClass='subscription-list' loadMore={this.loadMore}>
				{ plansList }
			</List>
		)
	}
}

function mapStateToProps(state) {
	console.log('SUB', getSubscriptionsModel(state));
	return {
		subscriptions: getSubscriptionsModel(state),
		readingPlans: getPlansModel(state),
		together: getTogetherModel(state),
		invitations: getTogetherInvitations(state),
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
	}
}

SubscriptionList.propTypes = {
	subscriptions: PropTypes.object.isRequired,
	readingPlans: PropTypes.object.isRequired,
	together: PropTypes.object.isRequired,
	invitations: PropTypes.array,
	auth: PropTypes.object.isRequired,
	language_tag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	localizedLink: PropTypes.func.isRequired,
}

SubscriptionList.defaultProps = {
	invitations: null,
}

export default connect(mapStateToProps, null)(SubscriptionList)
