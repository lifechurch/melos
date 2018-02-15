import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Inbox from '../../../components/Inbox'
import Settings from '../../../components/icons/Settings'
import IconButton from '../../../components/IconButton'
import NotificationsList from './NotificationsList'

function NotificationsInbox(props) {
	const { previewNum } = props

	return (
		<Inbox
			className='yv-notifications-inbox'
			heading={
				<div className='vertical-center space-between' style={{ width: '100%' }}>
					<FormattedMessage id='notifications' />
					<IconButton to='/notifications/edit' useClientRouting={false}>
						<Settings fill='gray' width={20} height={20} />
					</IconButton>
				</div>
			}
		>
			<NotificationsList previewNum={previewNum} />
		</Inbox>
	)
}

NotificationsInbox.propTypes = {
	previewNum: PropTypes.number,
}

NotificationsInbox.defaultProps = {
	previewNum: null,
}

export default NotificationsInbox
