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
		const { dispatch, params: { id, together_id }, auth, location: { query } } = this.props
		// join token will allow us to see the participants and together unauthed
		const token = query && query.token ? query.token : null
		dispatch(planView({
			plan_id: id.split('-')[0],
			together_id,
			token,
			auth,
		}))
		dispatch(plansAPI.actions.together.get({
			id: together_id,
			token
		}, { auth: auth && auth.isLoggedIn }))
	}

	localizedLink = (link) => {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	OnActionComplete = () => {
		const { auth, dispatch } = this.props
		dispatch(push(Routes.subscriptions({
			username: auth.userData.username
		})))
	}

	OnUnauthedAction = () => {
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
		const { plan, params: { together_id }, location: { query }, together, participants } = this.props

		const joinToken = query && query.token ? query.token : null
		const planImg = plan ?
					selectImageFromList({ images: plan.images, width: 640, height: 320 }).url :
					''
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
						<FormattedMessage id='x pending' values={{ number: invitedNum }} />
						&nbsp;
						&bull;
						&nbsp;
						<FormattedMessage id='x accepted' values={{ number: acceptedNum }} />
					</div>
				}
				startDate={<PlanStartString start_dt={together && together.start_dt} dateOnly />}
				joinToken={joinToken}
				showDecline={!joinToken}
				handleActionComplete={this.OnActionComplete}
				handleUnauthed={this.OnUnauthedAction}
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
		serverLanguageTag: state.serverLanguageTag
	}
}

InvitationView.propTypes = {
	plan: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	participants: PropTypes.object.isRequired,
	together: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object,
}

InvitationView.defaultProps = {
	location: {},
}

export default connect(mapStateToProps, null)(InvitationView)
