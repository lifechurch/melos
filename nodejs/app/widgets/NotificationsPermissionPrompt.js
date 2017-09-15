import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import messagingAction from '@youversion/api-redux/lib/endpoints/messaging/action'
import localStore from '../lib/localStore'
import Modal from '../components/Modal'
import ConfirmationDialog from '../components/ConfirmationDialog'
import YVLogo from '../components/YVLogo'



function isTokenSentToServer() {
	return localStore.get('sentToServer') === 1
}

function setTokenSentToServer(sent) {
	localStore.set('sentToServer', sent ? 1 : 0)
}

export function promptUserForNotificationsPermission(customMessage = null) {
	if (document) {
		document
			.getElementById('notifications-prompt')
			.dispatchEvent(new CustomEvent('notificationsPrompt', { detail: customMessage }))
	}
}

/**
 * NOTE: this expects a global setup of the firebase sdk like so:
 *
 *
 *   <script src="https://www.gstatic.com/firebasejs/4.3.1/firebase.js">
 *      var config = {
          apiKey: "AIzaSyA78msl5bye7HZuanHa-Ngcc56VPoDJNYw",
          authDomain: "bible-a366f.firebaseapp.com",
          databaseURL: "https://bible-a366f.firebaseio.com",
          projectId: "bible-a366f",
          storageBucket: "bible-a366f.appspot.com",
          firebaseMessagingSenderId: "108237832602"
        }
        firebase.initializeApp(config)
 *   </script>
 *
 *
		 const firebaseMessaging = firebase
		 		.firebaseMessaging()
				.useServiceWorker(serviceWorkerRegistration)
 */
class NotificationsPermissionPrompt extends Component {
/* eslint-disable no-undef */
	constructor(props) {
		super(props)
		this.state = {
			message: <FormattedMessage id='notifications' />
		}
	}

	componentDidMount() {
		this.prompt.addEventListener('notificationsPrompt', this.handleEvent, false)
	}

	onRequestPermission = () => {
		console.log('Requesting permission...')
		if (firebaseMessaging) {
			firebaseMessaging.requestPermission().then(() => {
				console.log('Notification permission granted.')
				// Get Instance ID token. Initially this makes a network call, once retrieved
				// subsequent calls to getToken will return from cache.
				firebaseMessaging.getToken().then((currentToken) => {
					if (currentToken) {
						this.sendTokenToServer(currentToken)
					} else {
						// Show permission request.
						console.log('No Instance ID token available. Request permission to generate one.')
						// Show permission UI.
						setTokenSentToServer(false)
					}
				}).catch((err) => {
					console.log('An error occurred while retrieving token. ', err)
					setTokenSentToServer(false)
				})
			}).catch((err) => {
				console.log('Unable to get permission to notify.', err)
			})
		}
	}

	handleEvent = (e) => {
		const { detail } = e
		if (detail) {
			this.setState({ message: detail })
			this.modal.handleOpen()
		}
	}

	/**
	 *  Send the Instance ID token your application server, so that it can:
			  - send messages back to this app
			  - subscribe/unsubscribe the token from topics
	 * @param  {[type]} currentToken [description]
	 * @return {[type]}              [description]
	 */
	sendTokenToServer = (currentToken) => {
		const { dispatch, auth: { isLoggedIn, userData } } = this.props
		console.log('sendTokenToServer?', !isTokenSentToServer())
		if (!isTokenSentToServer()) {
			console.log('Sending token to server...')
			dispatch(messagingAction({
				method: 'register',
				params: {
					id: currentToken,
					type: 'android',
					user_id: isLoggedIn && userData.userid
				},
			}))
			setTokenSentToServer(true)
		} else {
			console.log(
				'Token already sent to server so won\'t send it again unless it changes'
			)
		}
	}

	deleteToken = () => {
		// Delete Instance ID token.
		firebaseMessaging.getToken().then((currentToken) => {
			firebaseMessaging.deleteToken(currentToken).then(() => {
				console.log('Token deleted.')
				setTokenSentToServer(false)
			}).catch((err) => {
				console.log('Unable to delete token. ', err)
			})
		}).catch((err) => {
			console.log('Error retrieving Instance ID token. ', err)
		})
	}

	render() {
		const { message } = this.state

		return (
			<div ref={(prompt) => { this.prompt = prompt }} id='notifications-prompt'>
				<Modal
					ref={(mod) => { this.modal = mod }}
					showBackground={false}
					customClass='yv-drop-shadow white'
					style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}
				>
					<div style={{ width: '215px' }}>
						<ConfirmationDialog
							handleConfirm={this.onRequestPermission}
							handleCancel={() => { this.modal.handleClose() }}
							prompt={message}
							confirmPrompt={<FormattedMessage id='sure!' />}
							cancelPrompt={<FormattedMessage id='no thanks' />}
						/>
					</div>
				</Modal>
			</div>
		)
	}
}

NotificationsPermissionPrompt.propTypes = {

}

NotificationsPermissionPrompt.defaultProps = {

}

function mapStateToProps(state) {
	return {
		auth: state.auth,
	}
}

export default connect(mapStateToProps, null)(NotificationsPermissionPrompt)
