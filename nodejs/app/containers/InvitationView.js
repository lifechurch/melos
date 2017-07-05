import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
// actions
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import plansAPI, { getTogether } from '@youversion/api-redux/lib/endpoints/plans'
// models
import { getParticipantsUsersByTogetherId } from '@youversion/api-redux/lib/models'
// selectors
import { getPlanById } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
// utils
import { selectImageFromList } from '../lib/imageUtil'
import Routes from '../lib/routes'
// components
import TogetherInvitation from '../features/PlanDiscovery/components/TogetherInvitation'


class InvitationView extends Component {
	componentDidMount() {
		const { dispatch, params: { id, together_id }, auth, location: { query } } = this.props
		// join token will allow us to see the participants and together unauthed
		const token = query && query.token ? query.token : null
		dispatch(planView({
			plan_id: id.split('-')[0],
			together_id,
			token
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
		dispatch(routeActions.push(Routes.subscriptions({
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
		const { plan, params: { together_id }, location: { query }, together, participantsUsers } = this.props

		const joinToken = query && query.token ? query.token : null
		const planImg = plan ?
					selectImageFromList({ images: plan.images, width: 640, height: 320 }).url :
					''
		const planTitle = plan ? plan.name.default : null
		const planLink = plan ? plan.short_url : null
		const hostName = together && participantsUsers && together.host_user_id in participantsUsers ?
					participantsUsers[together.host_user_id].first_name :
					null
		const others = participantsUsers ?
					Object.keys(participantsUsers).length :
					null
		const startDate = together ? moment(together.start_dt) : null
		let invitedNum = 0
		let acceptedNum = 0
		if (participantsUsers) {
			Object.keys(participantsUsers).forEach((id) => {
				const user = participantsUsers[id]
				if (user.status === 'invited') invitedNum++
				if (user.status === 'accepted') acceptedNum++
			})
		}

		return (
			<TogetherInvitation
				together_id={together_id}
				planImg={planImg}
				planTitle={planTitle}
				planLink={planLink}
				invitationString={<FormattedMessage id='Together.invitation' values={{ host: hostName, others }} />}
				participantsString={
					<div>
						<FormattedMessage id='Together.invited' values={{ number: invitedNum }} />
						&nbsp;
						&bull;
						&nbsp;
						<FormattedMessage id='Together.accepted' values={{ number: acceptedNum }} />
					</div>
				}
				startDate={`${moment().to(startDate)} (${startDate.format('MMM D')})`}
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
		participantsUsers: getParticipantsUsersByTogetherId(state, together_id),
		together: getTogether(state),
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag
	}
}

InvitationView.propTypes = {
	plan: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	participantsUsers: PropTypes.object.isRequired,
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
