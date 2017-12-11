import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { push } from 'react-router-redux'
import friendsAction from '@youversion/api-redux/lib/endpoints/friends/action'
import { getFriends } from '@youversion/api-redux/lib/endpoints/friends/reducer'
import searchAction from '@youversion/api-redux/lib/endpoints/search/action'
import { getSearchUsers } from '@youversion/api-redux/lib/endpoints/search/reducer'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import getReadingPlans from '@youversion/api-redux/lib/models/readingPlans'
import InvitePWF from '../features/PlanDiscovery/components/InvitePWF'
import Routes from '@youversion/utils/lib/routes/routes'

class InvitePWFView extends Component {
	componentDidMount() {
		const { dispatch, params: { together_id } } = this.props
		this.getFriends()
		dispatch(plansAPI.actions.together.get({ id: together_id }, { auth: true }))
	}

	onHandleInvite = (ids) => {
		const { dispatch, auth, params: { together_id } } = this.props
		if (!ids || (ids && ids.length <= 150)) {
			dispatch(plansAPI.actions.participants.post({ id: together_id }, {
				body: ids,
				auth: auth.isLoggedIn
			})).then(() => {
				dispatch(push(Routes.subscriptions({ username: auth.userData.username })))
			})
		}
	}

	onHandleSearch = (query) => {
		const { dispatch, auth, serverLanguageTag } = this.props
		dispatch(searchAction({
			method: 'users',
			params: {
				language_tag: serverLanguageTag,
				query,
			},
			auth: auth.isLoggedIn,
		}))
	}

	getFriends = (page = 1) => {
		const { dispatch, auth } = this.props
		if (page) {
			dispatch(friendsAction({
				method: 'items',
				params: {
					page,
				},
				auth: auth.isLoggedIn,
			}))
		}
	}

	render() {
		const { together } = this.props
		return (
			<InvitePWF
				{...this.props}
				together_id={together && together.id}
				handleSearch={this.onHandleSearch}
				handleInvite={this.onHandleInvite}
				getFriends={this.getFriends}
			/>
		)
	}
}


function mapStateToProps(state, props) {
	const { params: { id, together_id } } = props
	const plan_id = id ? id.split('-')[0] : null
	return {
		planImg: getReadingPlans(state)
			&& getReadingPlans(state)
					.getPlanImgs({ id: plan_id, width: 640, height: 360 })
			&& getReadingPlans(state)
					.getPlanImgs({ id: plan_id, width: 640, height: 360 }).url,
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
		search: getSearchUsers(state),
		friends: getFriends(state),
		together: getTogetherModel(state) && together_id in getTogetherModel(state).byId
			? getTogetherModel(state).byId[together_id]
			: null,
	}
}

InvitePWFView.propTypes = {
	together: PropTypes.object.isRequired,
	friends: PropTypes.object.isRequired,
	search: PropTypes.array.isRequired,
	auth: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, null)(injectIntl(InvitePWFView))
