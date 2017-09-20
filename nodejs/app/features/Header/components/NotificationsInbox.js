import React, { Component, PropTypes } from 'react'
import Inbox from '../../../components/Inbox'

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
			<div>
				<Inbox heading={'Notifications'} />
			</div>
		)
	}
}

NotificationsInbox.propTypes = {

}

NotificationsInbox.defaultProps = {

}

export default NotificationsInbox
