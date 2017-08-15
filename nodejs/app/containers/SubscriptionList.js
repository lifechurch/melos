import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
// actions
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import customGet from '@youversion/api-redux/lib/customHelpers/get'
// models / selectors
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getTogetherInvitations, getParticipantsUsers } from '@youversion/api-redux/lib/models'
// utils
import { selectImageFromList } from '../lib/imageUtil'
import Routes from '../lib/routes'
import calcTodayVsStartDt from '../lib/calcTodayVsStartDt'
// components
import List from '../components/List'
import Modal from '../components/Modal'
import ShareLink from '../components/ShareLink'
import ParticipantsAvatarList from '../widgets/ParticipantsAvatarList'
import TogetherInvitationActions from '../widgets/TogetherInvitationActions'
import InvitationString from '../widgets/InvitationString'
import ProgressBar from '../components/ProgressBar'
import PlanStartString from '../features/PlanDiscovery/components/PlanStartString'
import PlanListItem from '../features/PlanDiscovery/components/PlanListItem'


class SubscriptionList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			inviteId: null
		}
	}

	componentDidMount() {
		const { auth, dispatch } = this.props
		this.username = (auth && auth.userData && auth.userData.username) ? auth.userData.username : null
		// get any invites we have
		this.getInvitations().then(() => {
			// get togethers that we are a host of so we can show the invite and change data actions
			// for plans in the future
			dispatch(plansAPI.actions.togethers.get({ status: 'host' }, { auth: true }))
		})
		// get actual subscriptions
		this.getSubs({ page: 1 })
	}

	getSubs = ({ page = null }) => {
		const { dispatch, auth, subscriptions, readingPlans } = this.props
		return dispatch(plansAPI.actions.subscriptions.get({ order: 'desc', page }, { auth: true })).then((subs) => {
			if (subs && subs.data) {
				const ids = Object.keys(subs.data)
				if (ids.length > 0) {
					ids.forEach((id) => {
						const sub = subs.data[id]
						if (!(sub.plan_id in readingPlans.byId)) {
							dispatch(planView({
								plan_id: sub.plan_id,
								together_id: sub.together_id,
								auth,
							}))
						}
						if (!(id in subscriptions.byId && 'overall' in subscriptions.byId[id])) {
							// get progress for progress bar
							customGet({
								actionName: 'progress',
								pathvars: {
									id,
									page: '*',
									fields: 'days,overall'
								},
								params: {
									auth: true,
								},
								dispatch,
								actions: plansAPI.actions,
								auth,
							})
						}
					})
				}
			}
		})
	}

	getInvitations = () => {
		const { dispatch, auth, readingPlans, participants } = this.props
		return dispatch(plansAPI.actions.togethers.get({ status: 'invited' }, { auth: true })).then((subs) => {
			if (subs && subs.data) {
				const ids = subs.map
				if (ids && ids.length > 0) {
					ids.forEach((id) => {
						const sub = subs.data[id]
						if (!(sub.plan_id in readingPlans.byId && id in participants)) {
							dispatch(planView({
								plan_id: sub.plan_id,
								together_id: id,
								auth,
							}))
						}
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
			subscriptions,
			localizedLink
		} = this.props
		const plan = (plan_id && plan_id in readingPlans.byId) ? readingPlans.byId[plan_id] : null
		const sub = (subscription_id && subscription_id in subscriptions.byId) ? subscriptions.byId[subscription_id] : null

		let link, src, subContent, dayString, progress, titleString, isInFuture
		if (start_dt && plan && 'id' in plan) {
			isInFuture = calcTodayVsStartDt(start_dt).isInFuture

			src = plan.images ?
				selectImageFromList({ images: plan.images, width: 160, height: 160 }).url :
				null
			progress = (
				<div style={{ padding: '5px 0', width: '50px' }}>
					<ProgressBar
						percentComplete={
							sub && sub.overall
								? sub.overall.completion_percentage
								: 0
						}
						color='gray'
					/>
				</div>
			)

			titleString = plan.name[language_tag] || plan.name.default

			// plans together have different strings
			if (together_id) {
				if (invitations.indexOf(together_id) > -1) {
					dayString = <PlanStartString start_dt={start_dt} />
					titleString = <InvitationString together_id={together_id} />
				}
				if (isInFuture) {
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
				if (isInFuture) {
					link = localizedLink(
						Routes.plan({
							plan_id: plan.id,
							slug: plan.slug,
						})
					)
				} else {
					link = localizedLink(
						Routes.subscription({
							username: this.username,
							plan_id: plan.id,
							slug: plan.slug,
							subscription_id,
						})
					)
				}
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
					{ sub && !isInFuture && progress }
					<div style={{ padding: '5px 0' }}>
						<ParticipantsAvatarList
							together_id={together_id}
							plan_id={plan_id}
							avatarWidth={26}
							// if it's an invitation, we want to show all participants
							// otherwise, let's just show accetped and host
							statusFilter={subscription_id ? ['accepted', 'host'] : null}
						/>
					</div>
					{ dayString }
				</div>
			)
		}

		return (
			<PlanListItem
				key={`${plan_id}.${subscription_id}`}
				src={src}
				name={titleString}
				link={link}
				subContent={subContent}
			/>
		)
	}


	render() {
		const { subscriptions, together, invitations, auth, intl } = this.props
		const { inviteId } = this.state

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
				if (sub && sub.plan_id && !sub.completed_dt) {
					plansList.push(
						<div key={id}>
							{
								this.renderListItem({
									plan_id: sub.plan_id,
									together_id: sub.together_id,
									start_dt: sub.start_dt,
									subscription_id: id,
								})
							}
							{
								// show host actions on a together that starts in the future
								sub.together_id
									&& auth && auth.userData && auth.userData.userid
									&& sub.together_id in together.byId
									&& auth.userData.userid === together.byId[sub.together_id].host_user_id
									&& calcTodayVsStartDt(sub.start_dt).isInFuture
									&& (
										<div className='invitation-actions vertical-center'>
											<a
												tabIndex={0}
												className='yv-green-link'
												onClick={() => {
													this.setState({ inviteId: sub.together_id })
													this.modal.handleOpen()
												}}
											>
												<FormattedMessage id='invite others' />
											</a>
											<Link
												to={Routes.togetherCreate({
													username: auth && auth.userData && auth.userData.username,
													plan_id: sub.plan_id,
													query: {
														subscription_id: id,
													}
												})}
												className='yv-gray-link'
											>
												<FormattedMessage id='change date' />
											</Link>
										</div>
									)
							}
						</div>
					)
				}
				return null
			})
		}

		let shareLink = null
		if (inviteId && together && together.byId[inviteId]) {
			shareLink = together.byId[inviteId].public_share
		}

		return (
			<div>
				<List customClass='subscription-list' loadMore={this.loadMore}>
					{
						plansList.length > 0
							? plansList
							: <FormattedMessage id='plans.you have no plans' />
					}
				</List>
				<Modal
					ref={(ref) => { this.modal = ref }}
					customClass='large-5 medium-8 small-11'
					handleCloseCallback={() => {
						this.setState({ inviteId: null })
					}}
				>
					{
						inviteId
							&& shareLink
							&& (
								<ShareLink
									link={shareLink}
									text={intl.formatMessage({ id: 'join together' })}
									description={<FormattedMessage id='use share link' />}
								/>
							)
					}
				</Modal>
			</div>
		)
	}
}

function mapStateToProps(state) {
	console.log('SUB', getSubscriptionsModel(state));
	console.log('TOGETHER', getTogetherModel(state));
	return {
		subscriptions: getSubscriptionsModel(state),
		readingPlans: getPlansModel(state),
		together: getTogetherModel(state),
		invitations: getTogetherInvitations(state),
		participants: getParticipantsUsers(state),
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
	}
}

SubscriptionList.propTypes = {
	subscriptions: PropTypes.object.isRequired,
	readingPlans: PropTypes.object.isRequired,
	together: PropTypes.object.isRequired,
	participants: PropTypes.object.isRequired,
	invitations: PropTypes.array,
	auth: PropTypes.object.isRequired,
	language_tag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	localizedLink: PropTypes.func.isRequired,
	intl: PropTypes.func.isRequired,
}

SubscriptionList.defaultProps = {
	invitations: null,
}

export default connect(mapStateToProps, null)(injectIntl(SubscriptionList))
