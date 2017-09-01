import React, { PropTypes, Component } from 'react'
import Immutable from 'immutable'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { connect } from 'react-redux'
import friendshipsAction from '@youversion/api-redux/lib/endpoints/friendships/action'
import { getFriendshipRequests } from '@youversion/api-redux/lib/endpoints/friendships/reducer'
import notificationsAction from '@youversion/api-redux/lib/endpoints/notifications/action'
import { getNotifications } from '@youversion/api-redux/lib/endpoints/notifications/reducer'
import usersAction from '@youversion/api-redux/lib/endpoints/users/action'
import { getUserById, getLoggedInUser } from '@youversion/api-redux/lib/endpoints/users/reducer'
import SectionedHeading from '../../../components/SectionedHeading'
import YouVersion from '../../../components/YVLogo'
import IconButtonGroup from '../../../components/IconButtonGroup'
import IconButton from '../../../components/IconButton'
import NoticeIcon from '../../../components/NoticeIcon'
import DropdownTransition from '../../../components/DropdownTransition'
import Card from '../../../components/Card'
import DropDownArrow from '../../../components/DropDownArrow'
import XMark from '../../../components/XMark'
import { localizedLink } from '../../../lib/routeUtils'
import Home from '../../../components/icons/Home'
import Read from '../../../components/icons/Read'
import Plans from '../../../components/icons/Plans'
import Videos from '../../../components/icons/Videos'
import Friends from '../../../components/icons/Friends'
import Notifications from '../../../components/icons/Notifications'
import Settings from '../../../components/icons/Settings'
import Avatar from '../../../components/Avatar'

class Header extends Component {
	constructor(props) {
		super(props)
		this.didScroll = false
		this.state = {
			isLoggedIn: false,
			userId: null,
			ready: false
		}
	}

	componentDidMount() {
		const { dispatch, auth, loggedInUser } = this.props

		if (loggedInUser) {
			const userId = loggedInUser.userid
			this.setState({ ready: true, isLoggedIn: true, userId })
			dispatch(friendshipsAction({ method: 'incoming', params: { page: 1 }, auth: true }))
			dispatch(notificationsAction({ method: 'items', auth: true }))
			dispatch(usersAction({ method: 'view', params: { id: userId } }))
		} else {
			this.setState({ ready: true, isLoggedIn: false, userId: null })
		}
	}

	componentWillReceiveProps(nextProps) {
		const { notifications: nextNotifications, friendshipRequests: nextFriendshipRequests } = nextProps
		const { notifications, friendshipRequests } = this.props

		if (nextNotifications && nextNotifications !== notifications) {
			let hasNotifications = false
			if ('items' in nextNotifications && Array.isArray(nextNotifications.items) && nextNotifications.items.length > 0) {
				hasNotifications = true
			}
			this.setState({ hasNotifications })
		}

		if (nextFriendshipRequests && nextFriendshipRequests !== friendshipRequests) {
			let hasFriendshipRequests = false
			if ('items' in nextFriendshipRequests && Array.isArray(nextFriendshipRequests.users) && nextFriendshipRequests.users.length > 0) {
				hasFriendshipRequests = true
			}
			this.setState({ hasFriendshipRequests })
		}
	}

	render() {
		const {
			serverLanguageTag,
			locale,
			user,
			loggedInUser
		} = this.props

		const {
			state,
			hasNotifications,
			hasFriendshipRequests,
			isLoggedIn,
			ready
		} = this.state

		const left = (
			<div>
				<IconButtonGroup iconHeight={24} iconSpacing={44} iconFill="#a2a2a2" labelColor="#a2a2a2" iconActiveFill="#444444" labelActiveColor="#444444" >
					<IconButton label="Home" useClientRouting={false} to="/">
						<Home />
					</IconButton>
					<IconButton label="Read" useClientRouting={false} to="/bible">
						<Read />
					</IconButton>
					<IconButton label="Plans" useClientRouting={false} to="/reading-plans">
						<Plans />
					</IconButton>
					<IconButton label="Videos" useClientRouting={false} to="/videos">
						<Videos />
					</IconButton>
				</IconButtonGroup>
			</div>
		)

		const right = isLoggedIn
		? (
			<div>
				<IconButtonGroup iconHeight={24} iconSpacing={24} iconFill="#000000" alignTo="middle">
					<IconButton>
						<NoticeIcon showNotice={hasNotifications}>
							<Notifications />
						</NoticeIcon>
					</IconButton>
					<IconButton>
						<NoticeIcon showNotice={hasFriendshipRequests}>
							<Friends />
						</NoticeIcon>
					</IconButton>
					<IconButton>
						<Settings />
					</IconButton>
					<IconButton lockHeight={true}>
						{'response' in user && <Avatar placeholderText={loggedInUser.first_name[0].toUpperCase()} width={36} height={36} src={user.response.user_avatar_url.px_48x48} />}
					</IconButton>
				</IconButtonGroup>
			</div>
		)
		: (
			<div>
				<button />
			</div>
		)

		return (
			<div className="yv-header">
				<SectionedHeading
					left={left}
					right={ready && right}
				>
					<div className="yv-header-search">
						<input type="text" />
					</div>
				</SectionedHeading>
			</div>
		)
	}
}


Header.propTypes = {
	serverLanguageTag: PropTypes.string,
	auth: PropTypes.object,
	locale: PropTypes.object,
	dispatch: PropTypes.func.isRequired
}

Header.defaultProps = {
	serverLanguageTag: 'en',
	auth: {},
	locale: {}
}

function mapStateToProps(state) {
	const loggedInUser = getLoggedInUser(state)
	return {
		serverLanguageTag: state.serverLanguageTag,
		auth: state.auth,
		locale: state.locale,
		notifications: getNotifications(state),
		friendshipRequests: getFriendshipRequests(state),
		loggedInUser,
		user: getUserById(state, loggedInUser.userid)
	}
}

export default connect(mapStateToProps, null)(Header)
