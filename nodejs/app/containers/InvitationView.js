import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { FormattedMessage } from 'react-intl'
// actions
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
// models
import { getParticipantsUsers } from '@youversion/api-redux/lib/models'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
// selectors
import { getPlanById } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
// utils
import { selectImageFromList } from '../lib/imageUtil'
import Routes from '../lib/routes'
// components
import TogetherInvitation from '../features/PlanDiscovery/components/TogetherInvitation'
import PlanStartString from '../features/PlanDiscovery/components/PlanStartString'


class InvitationView extends Component {
	componentDidMount() {
		const {
			dispatch,
			params: { id, together_id },
			auth,
			location: { query },
			plan,
			participants,
			serverLanguageTag
		} = this.props
		// join token will allow us to see the participants and together unauthed
		this.joinToken = query && query.token ? query.token : null
		if (!(plan && participants && participants.filter({ together_id, idOnly: true }).length > 0)) {
			dispatch(planView({
				plan_id: id.split('-')[0],
				together_id,
				token: this.joinToken,
				auth,
				serverLanguageTag,
			}))
		}
		dispatch(plansAPI.actions.together.get({
			id: together_id,
			token: this.joinToken
		}, { auth: auth && auth.isLoggedIn })).then((data) => {
			if (!(data && data.data)) {
				this.onUnauthedAction()
			}
		})
	}

	onActionComplete = () => {
		const { auth, dispatch } = this.props
		if (auth.isLoggedIn) {
			dispatch(push(Routes.subscriptions({
				username: auth.userData.username
			})))
		} else if (window) {
			window.location.href = Routes.signIn({
				query: {
					redirect: window.location.href
				}
			})
		}
	}

	onUnauthedAction = () => {
		// redirect to sign up
		if (window) {
			window.location.href = Routes.signUp({
				query: {
					redirect: window.location.href
				}
			})
		}
	}

	render() {
		const { plan, params: { together_id }, together, participants } = this.props

		const planImg = plan
			? selectImageFromList({ images: plan.images, width: 640, height: 320 }).url
			: ''
		const planTitle = plan ? plan.name.default : null
		const planLink = plan ? plan.short_url : null
		const invitedNum = participants
			&& participants.filter({ together_id, statusFilter: 'invited', idOnly: true })
			? participants.filter({ together_id, statusFilter: 'invited', idOnly: true }).length
			: 0
		const acceptedNum = participants
			&& participants.filter({ together_id, statusFilter: ['host', 'accepted'], idOnly: true })
			? participants.filter({ together_id, statusFilter: ['host', 'accepted'], idOnly: true }).length
			: 0

		return (
			<TogetherInvitation
				together_id={together_id}
				planImg={planImg}
				planTitle={planTitle}
				planLink={planLink}
				participantsString={
					<div>
						{
							invitedNum > 1
								? <FormattedMessage id='x pending.other' values={{ number: invitedNum }} />
								: <FormattedMessage id='x pending.one' values={{ number: invitedNum }} />
						}
						&nbsp;
						&bull;
						&nbsp;
						{
							acceptedNum > 1
								? <FormattedMessage id='x accepted.other' values={{ number: acceptedNum }} />
								: <FormattedMessage id='x accepted.one' values={{ number: acceptedNum }} />
						}
					</div>
				}
				startDate={<PlanStartString start_dt={together && together.start_dt} dateOnly />}
				joinToken={this.joinToken}
				showDecline={!this.joinToken}
				handleActionComplete={this.onActionComplete}
				handleUnauthed={this.onUnauthedAction}
			/>
		)
	}
}


function mapStateToProps(state, props) {
	const { params: { id, together_id } } = props
	const plan_id = id ? id.split('-')[0] : null
	return {
		plan: getPlanById(state, plan_id),
		participants: getParticipantsUsers(state),
		together: getTogetherModel(state) && together_id in getTogetherModel(state).byId
			? getTogetherModel(state).byId[together_id]
			: null,
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
	}
}

InvitationView.propTypes = {
	plan: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	participants: PropTypes.object.isRequired,
	together: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object,
	serverLanguageTag: PropTypes.string.isRequired,
}

InvitationView.defaultProps = {
	location: {},
}

export default connect(mapStateToProps, null)(InvitationView)
