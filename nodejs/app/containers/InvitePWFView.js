import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { routeActions } from 'react-router-redux'
import friendsAction from '@youversion/api-redux/lib/endpoints/friends/action'
import { getFriends } from '@youversion/api-redux/lib/endpoints/friends/reducer'
import searchAction from '@youversion/api-redux/lib/endpoints/search/action'
import { getSearchUsers } from '@youversion/api-redux/lib/endpoints/search/reducer'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import InvitePWF from '../features/PlanDiscovery/components/InvitePWF'
import Routes from '../lib/routes'

class InvitePWFView extends Component {

	componentDidMount() {
		const { dispatch, auth, params: { together_id } } = this.props
		dispatch(friendsAction({
			method: 'items',
			params: {
				page: 1,
			},
			auth: auth.isLoggedIn,
		}))
		dispatch(plansAPI.actions.together.get({ id: together_id }, { auth: true }))
	}

	onHandleInvite = (ids) => {
		const { dispatch, auth, params: { together_id } } = this.props
		dispatch(plansAPI.actions.participants.post({ id: together_id }, {
			body: ids,
			auth: auth.isLoggedIn
		})).then(() => {
			dispatch(routeActions.push(Routes.subscriptions({ username: auth.userData.username })))
		})
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
		const { together } = this.props

		return (
			<InvitePWF
				{...this.props}
				together_id={together && together.id}
				handleSearch={this.onHandleSearch}
				handleInvite={this.onHandleInvite}
				localizedLink={this.localizedLink}
			/>
		)
	}
}


function mapStateToProps(state, props) {
	const { params: { together_id } } = props
	console.log('TOG', getTogetherModel(state))
	return {
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
	friends: PropTypes.array.isRequired,
	search: PropTypes.array.isRequired,
	auth: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, null)(injectIntl(InvitePWFView))
