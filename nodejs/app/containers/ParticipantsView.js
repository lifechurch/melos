import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import { getParticipantsUsersByTogetherId } from '@youversion/api-redux/lib/models'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getPlanById } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import { selectImageFromList } from '../lib/imageUtil'
import Participants from '../features/PlanDiscovery/components/Participants'


class ParticipantsView extends Component {
	componentDidMount() {
		const { dispatch, auth, params: { id, together_id }, location: { query } } = this.props

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

	render() {
		const { plan, participantsUsers, together } = this.props
		let userList = null
		if (participantsUsers) {
			userList = Object.keys(participantsUsers).map((userid) => {
				const user = participantsUsers[userid]
				return user
			})
		}
		const src = plan && plan.images ? selectImageFromList({ images: plan.images, width: 640, height: 320 }).url : ''

		return (
			<Participants
				planImg={src}
				users={userList}
				shareLink={together && together.public_share ? together.public_share : null}
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
		together: getTogetherModel(state) && together_id in getTogetherModel(state).byId
			? getTogetherModel(state).byId[together_id]
			: null,
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
	}
}

ParticipantsView.propTypes = {
	plan: PropTypes.object.isRequired,
	together: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	participantsUsers: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, null)(injectIntl(ParticipantsView))
