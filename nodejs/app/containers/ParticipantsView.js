import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import participantsView from '@youversion/api-redux/lib/batchedActions/participantsUsersView'
import { getParticipantsUsersByTogetherId } from '@youversion/api-redux/lib/models'
import { getPlanById } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import { selectImageFromList } from '../lib/imageUtil'
import Participants from '../features/PlanDiscovery/components/Participants'


class ParticipantsView extends Component {
	componentDidMount() {
		const { dispatch, auth, params: { id, together_id, token }, serverLanguageTag } = this.props

		dispatch(readingPlansAction({
			method: 'view',
			params: {
				id: id.split('-')[0],
			},
		}))
		dispatch(participantsView({
			together_id,
			user_id: auth && auth.userData && auth.userData.userid,
			language_tag: serverLanguageTag,
			token,
		}))
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
		const { plan, participantsUsers } = this.props
		let userList = null
		if (participantsUsers) {
			userList = Object.keys(participantsUsers).map((userid) => {
				const user = participantsUsers[userid]
				return user
			})
		}
		const src = plan ? selectImageFromList({ images: plan.images, width: 640, height: 320 }).url : ''

		return (
			<Participants
				planImg={src}
				users={userList}
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
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
	}
}

ParticipantsView.propTypes = {
	plan: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	participantsUsers: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, null)(injectIntl(ParticipantsView))
