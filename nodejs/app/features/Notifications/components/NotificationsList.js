import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import notificationsAction from '@youversion/api-redux/lib/endpoints/notifications/action'
import { getNotifications } from '@youversion/api-redux/lib/endpoints/notifications/reducer'
import User from '../../../components/User'
import { selectImageFromList } from '../../../lib/imageUtil'

class NotificationsList extends Component {
	componentDidMount() {
		const { dispatch, notifications } = this.props
		if (!notifications) {
			dispatch(notificationsAction({ method: 'items', auth: true }))
		}
	}

	render() {
		const {
			notifications,
			previewNum,
			avatarWidth,
			className,
		} = this.props

		const notificationsItems = notifications
			&& notifications.items
			&& notifications.items.length > 0
			? notifications.items
			: null

		const list = previewNum
			? (notificationsItems && notificationsItems.slice(0, previewNum))
			: notificationsItems

		return (
			<div className={`yv-notifications-list ${className}`}>
				{
					list
						? list.map((item) => {
							if (!(item && item.base)) {
								return null
							} else {
								const time = moment(item.created_dt).fromNow()
								const notification = item.base
								const avatar = notification
									&& notification.images
									&& notification.images.avatar
								const avatarUrl = selectImageFromList({
									images: avatar && avatar.renditions,
									width: avatarWidth * 2,
									height: avatarWidth * 2,
								}).url
								const stringId = notification
									&& notification.title
									&& notification.title.l_str

								return (
									<a
										tabIndex={0}
										key={item.created_dt}
										className='yv-notification'
										href={notification.action_url}
										style={{ display: 'block' }}
									>
										<User
											src={avatarUrl}
											heading={
												stringId &&
												<FormattedMessage
													id={stringId}
													values={(notification.title && notification.title.l_args) || {}}
												/>
											}
											subheading={time}
											width={avatarWidth}
											avatarLetter={avatar && avatar.accessibility && avatar.accessibility[0]}
										/>
									</a>
								)
							}
						})
						: (
							<div className='yv-notification'>
								<FormattedMessage id='no notifications' />
							</div>
						)
				}
				{
					previewNum
						&& notificationsItems
						&& previewNum < notificationsItems.length
						&& (
							<a
								tabIndex={0}
								target='_self'
								href='/notifications'
								className='yv-green-link text-center'
								style={{ padding: '5px', display: 'block', fontSize: '15px' }}
							>
								<FormattedMessage id='plans.stats.view all' />
							</a>
						)
				}
			</div>
		)
	}
}

NotificationsList.propTypes = {
	avatarWidth: PropTypes.number,
	previewNum: PropTypes.number,
	notifications: PropTypes.object,
	className: PropTypes.string,
	dispatch: PropTypes.func.isRequired,
}

NotificationsList.defaultProps = {
	avatarWidth: 36,
	previewNum: null,
	notifications: null,
	className: '',
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		notifications: getNotifications(state),
	}
}

export default connect(mapStateToProps, null)(NotificationsList)
