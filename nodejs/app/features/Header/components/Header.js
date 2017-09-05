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
import ProfileMenu from './ProfileMenu'
import Search from '../../../components/Search'

class Header extends Component {
	constructor(props) {
		super(props)
		this.didScroll = false
		this.state = {
			isLoggedIn: false,
			userId: null,
			ready: false,
			profileMenuOpen: false
		}
	}

	componentDidMount() {
		const { dispatch, auth, loggedInUser } = this.props

		if (loggedInUser) {
			const userId = loggedInUser.userid
			this.setState({ isLoggedIn: true, userId })
			dispatch(friendshipsAction({ method: 'incoming', params: { page: 1 }, auth: true }))
			dispatch(notificationsAction({ method: 'items', auth: true }))
			dispatch(usersAction({ method: 'view', params: { id: userId } })).then(() => {
				this.setState({ ready: true })
			})
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
			if ('users' in nextFriendshipRequests && Array.isArray(nextFriendshipRequests.users) && nextFriendshipRequests.users.length > 0) {
				hasFriendshipRequests = true
			}
			this.setState({ hasFriendshipRequests })
		}
	}

	handleProfileMenuClick = () => {
		this.setState((state) => {
			return { profileMenuOpen: !state.profileMenuOpen }
		})
	}

	handleProfileMenuClose = () => {
		this.setState({ profileMenuOpen: false })
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
			ready,
			profileMenuOpen
		} = this.state

		const left = (
			<div>
				<IconButtonGroup iconHeight={24} iconSpacing={44} iconFill="#a2a2a2" labelColor="#a2a2a2" iconActiveFill="#444444" labelActiveColor="#444444" >
					<IconButton label="Home" useClientRouting={false} to={localizedLink('/', serverLanguageTag)}>
						<Home />
					</IconButton>
					<IconButton label="Read" useClientRouting={false} to={localizedLink('/bible', serverLanguageTag)}>
						<Read />
					</IconButton>
					<IconButton label="Plans" useClientRouting={false} to={localizedLink('/reading-plans', serverLanguageTag)}>
						<Plans />
					</IconButton>
					<IconButton label="Videos" useClientRouting={false} to={localizedLink('/videos', serverLanguageTag)}>
						<Videos />
					</IconButton>
				</IconButtonGroup>
			</div>
		)

		const right = isLoggedIn
		? (
			<div className={`yv-header-right ${ready && 'ready'}`}>
				<IconButtonGroup iconHeight={24} iconSpacing={24} iconFill="#a2a2a2" iconActiveFill="#444444" alignTo="middle">
					<IconButton to={localizedLink('/notifications', serverLanguageTag)} useClientRouting={false}>
						<NoticeIcon showNotice={hasNotifications}>
							<Notifications />
						</NoticeIcon>
					</IconButton>
					<IconButton to={localizedLink('/friends', serverLanguageTag)} useClientRouting={false}>
						<NoticeIcon showNotice={hasFriendshipRequests}>
							<Friends />
						</NoticeIcon>
					</IconButton>
					<IconButton to={localizedLink('/settings', serverLanguageTag)} useClientRouting={false}>
						<Settings />
					</IconButton>
					<IconButton lockHeight={true}>
						{'response' in user && <Avatar customClass="yv-profile-menu-trigger" onClick={this.handleProfileMenuClick} placeholderText={loggedInUser.first_name[0].toUpperCase()} width={36} height={36} src={user.response.user_avatar_url.px_48x48} />}
					</IconButton>
				</IconButtonGroup>
				{'response' in user &&
					<DropdownTransition
						show={profileMenuOpen}
						hideDir="up"
						transition={true}
						onOutsideClick={this.handleProfileMenuClose}
						exemptClass="yv-profile-menu-trigger"
						classes="yv-popup-modal-content"
						containerClasses="yv-profile-menu-container"
					>
						<ProfileMenu
							username={user.response.username}
							firstName={user.response.first_name}
							lastName={user.response.last_name}
							avatarUrl={user.response.user_avatar_url.px_48x48}
							serverLanguageTag={serverLanguageTag}
						/>
					</DropdownTransition>
				}
			</div>
		)
		: (
			<div className={`yv-header-right ${ready && 'ready'}`}>
				<button />
			</div>
		)

		return (
			<div className="yv-header">
				<SectionedHeading
					left={left}
					right={right}
				>
					<div><Search placeholder="Search..." /></div>
					{/* <div className="yv-header-search">
						<input type="text" />
					</div> */}
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
