import React, { PropTypes, Component } from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { connect } from 'react-redux'
import friendshipsAction from '@youversion/api-redux/lib/endpoints/friendships/action'
import { getFriendshipRequests } from '@youversion/api-redux/lib/endpoints/friendships/reducer'
import notificationsAction from '@youversion/api-redux/lib/endpoints/notifications/action'
import { getNotifications } from '@youversion/api-redux/lib/endpoints/notifications/reducer'
import SectionedHeading from '../../../components/SectionedHeading'
import YouVersion from '../../../components/YVLogo'
import IconButtonGroup from '../../../components/IconButtonGroup'
import IconButton from '../../../components/IconButton'
import NoticeIcon from '../../../components/NoticeIcon'
import DropdownTransition from '../../../components/DropdownTransition'
import Card from '../../../components/Card'
import FacebookLogo from '../../../components/FacebookLogo'
import TwitterLogo from '../../../components/TwitterLogo'
import InstagramLogo from '../../../components/InstagramLogo'
import YouTubeLogo from '../../../components/YouTubeLogo'
import PinterestLogo from '../../../components/PinterestLogo'
import DropDownArrow from '../../../components/DropDownArrow'
import XMark from '../../../components/XMark'
import { localizedLink } from '../../../lib/routeUtils'


class Header extends Component {
	constructor(props) {
		super(props)
		this.didScroll = false
		this.state = {
			state: 'fixed',
			lastScrollTop: 0
		}
	}

	componentDidMount() {
		const { dispatch } = this.props

		window.addEventListener('scroll', () => {
			this.didScroll = true
		})

		setInterval(() => {
			if (this.didScroll) {
				this.didScroll = false
				this.handleScroll()
			}
		}, 250)

		dispatch(friendshipsAction({ method: 'incoming', params: { page: 1 }, auth: true }))
		dispatch(notificationsAction({ method: 'items', auth: true }))
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

	handleScroll = () => {
		const { lastScrollTop } = this.state
		const scrollTop = (window.pageYOffset || document.documentElement.scrollTop)
		const atBottom = ((window.innerHeight + Math.ceil(window.pageYOffset + 1)) >= document.body.scrollHeight - 105)
		let state
		if (atBottom) {
			state = 'fixed'
		} else if (lastScrollTop < scrollTop) {
			// scroll down
			state = 'hidden'
		} else {
			// scroll up
			state = 'fixed'
		}

		this.setState(() => {
			return {
				state,
				lastScrollTop: scrollTop
			}
		})
	}

	render() {
		const {
			serverLanguageTag,
			locale
		} = this.props

		const {
			state,
			hasNotifications,
			hasFriendshipRequests
		} = this.state

		const left = (
			<div>
				<IconButtonGroup iconHeight={15}>
					<IconButton label="Home">
						<InstagramLogo />
					</IconButton>
					<IconButton label="Away">
						<YouTubeLogo />
					</IconButton>
				</IconButtonGroup>
			</div>
		)

		const right = (
			<div >
				<NoticeIcon showNotice={hasNotifications}>
					<InstagramLogo height={15} />
				</NoticeIcon>
			</div>
		)

		return (
			<div className="yv-header">
				<SectionedHeading
					left={left}
					right={right}
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
	return {
		serverLanguageTag: state.serverLanguageTag,
		auth: state.auth,
		locale: state.locale,
		notifications: getNotifications(state),
		friendshipRequests: getFriendshipRequests(state)
	}
}

export default connect(mapStateToProps, null)(Header)
