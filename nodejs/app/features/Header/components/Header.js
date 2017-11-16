import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import withGoogle from '@youversion/react-components/dist/components/auth/hocs/withGoogle'
import { getFriendshipRequests } from '@youversion/api-redux/lib/endpoints/friendships/reducer'
import { getNotifications } from '@youversion/api-redux/lib/endpoints/notifications/reducer'
import { getUserById, getLoggedInUser } from '@youversion/api-redux/lib/endpoints/users/reducer'
import ResponsiveContainer from '../../../components/ResponsiveContainer'
import HeaderContent from './HeaderContent'


function Header(props) {
	return (
		<ResponsiveContainer>
			<HeaderContent {...props} />
		</ResponsiveContainer>
	)
}

Header.propTypes = {
	serverLanguageTag: PropTypes.string,
	dispatch: PropTypes.func.isRequired,
	loggedInUser: PropTypes.object,
	notifications: PropTypes.object,
	friendshipRequests: PropTypes.object,
	user: PropTypes.object
}

Header.defaultProps = {
	serverLanguageTag: 'en',
	loggedInUser: null,
	notifications: null,
	friendshipRequests: null,
	user: null
}

function mapStateToProps(state) {
	const loggedInUser = getLoggedInUser(state)
	return {
		serverLanguageTag: state.serverLanguageTag,
		locale: state.locale,
		notifications: getNotifications(state),
		friendshipRequests: getFriendshipRequests(state),
		loggedInUser,
		user: getUserById(state, loggedInUser.userid)
	}
}

export default connect(mapStateToProps, null)(withGoogle(Header))
