import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { getNotifications } from '@youversion/api-redux/lib/endpoints/notifications/reducer'
import User from '../../../components/User'
import { selectImageFromList } from '../../../lib/imageUtil'

class NotificationsList extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {

	}

	componentDidUpdate(prevProps, prevState) {

	}

	render() {
		const { notifications, previewNum, avatarWidth } = this.props

		const notificationsItems = notifications
			&& notifications.items
			&& notifications.items.length > 0
			&& notifications.items
		return (
			<div className='notifications-list'>
				{
					notificationsItems
						&& notificationsItems.map((item, i) => {
							if (previewNum && ((i + 1) > previewNum)) return null

							const time = moment(item.created_dt).fromNow()
							const notification = item.base
							const avatarUrl = selectImageFromList({
								images: notification
									&& notification.images
									&& notification.images.avatar
									&& notification.images.avatar.renditions,
								width: avatarWidth,
								height: avatarWidth,
							}).url
							return (
								<div key={item.created_dt} className='notification'>
									<User
										src={avatarUrl}
										heading={notification.title && notification.title.l_str}
										subheading={time}
										link={notification.action_url}
										width={avatarWidth}
									/>
								</div>
							)
						})
				}
				{
					previewNum
						&& notificationsItems
						&& previewNum < notificationsItems.length
						&& (
							<a
								tabIndex={0}
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
}

NotificationsList.defaultProps = {
	avatarWidth: 36,
	previewNum: null,
	notifications: null,
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		notifications: getNotifications(state),
	}
}

export default connect(mapStateToProps, null)(NotificationsList)
