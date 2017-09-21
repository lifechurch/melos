import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Inbox from '../../../components/Inbox'
import Settings from '../../../components/icons/Settings'
import IconButton from '../../../components/IconButton'
import NotificationsList from './NotificationsList'

class NotificationsInbox extends Component {
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
		const { previewNum } = this.props

		return (
			<Inbox
				className='notifications-inbox'
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
}

NotificationsInbox.propTypes = {

}

NotificationsInbox.defaultProps = {

}

export default NotificationsInbox
