import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import messagingAction from '@youversion/api-redux/lib/endpoints/messaging/action'
import LocalStore from '@youversion/utils/lib/localStore'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import Modal from '../components/Modal'
import ConfirmationDialog from '../components/ConfirmationDialog'
import ViewportUtils from '../lib/viewportUtils'


function isTokenSentToServer() {
	return parseInt(LocalStore.get('sentToServer'), 10) === 1
}

function setTokenSentToServer(sent) {
	LocalStore.set('sentToServer', sent ? 1 : 0)
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
		// listener for event to open the dialog to ask user for permission
		this.prompt.addEventListener('notificationsPrompt', this.handleEvent, false)
		// listener to send off refreshed token from the initial messaging setup
		// on the rails side
		this.prompt.addEventListener(
			'sendTokenToServer',
			(e) => {
				this.sendTokenToServer(e.detail)
			},
			false
		)
		this.viewport = new ViewportUtils()
	}

	onRequestPermission = () => {
		this.modal.handleClose()
		if (firebaseMessaging) {
			firebaseMessaging.requestPermission().then(() => {
					// Get Instance ID token. Initially this makes a network call, once retrieved
					// subsequent calls to getToken will return from cache.
				firebaseMessaging.getToken().then((currentToken) => {
					if (currentToken) {
						this.sendTokenToServer(currentToken)
					} else {
							// Show permission request.
							// Show permission UI.
						setTokenSentToServer(false)
					}
				}).catch((err) => {
					setTokenSentToServer(false)
				})
			}).catch((err) => {
			})
		}
	}

	handleEvent = (e) => {
		const { detail } = e
		if (
			'serviceWorker' in navigator
			&& !isTokenSentToServer()
			&& firebaseMessaging
		) {
			if (detail) {
				this.setState({ message: detail })
			}
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
		if (!isTokenSentToServer() && currentToken) {
			dispatch(messagingAction({
				method: 'register',
				params: {
					id: currentToken,
					type: 'android',
					user_id: isLoggedIn && userData.userid
				},
			}))
			setTokenSentToServer(true)
		}
	}

	deleteToken = () => {
		// Delete Instance ID token.
		firebaseMessaging.getToken().then((currentToken) => {
			firebaseMessaging.deleteToken(currentToken).then(() => {
				setTokenSentToServer(false)
			}).catch((err) => {
				console.log('Unable to delete token. ', err)
			})
		}).catch((err) => {
			console.log('Error retrieving Instance ID token. ', err)
		})
	}

	render() {
		const { serverLanguageTag } = this.props
		const { message } = this.state

		const isMobileScreen = this.viewport
			&& this.viewport.getViewport()
			&& this.viewport.getViewport().width <= 599
		const promptContent = (
			<div className='confirm-wrapper'>
				<ConfirmationDialog
					handleConfirm={this.onRequestPermission}
					handleCancel={() => { this.modal.handleClose() }}
					prompt={
						<div
							className={`flex-wrap ${isMobileScreen
								? 'flex-start'
								: 'horizontal-center'
							}`}
						>
							<LazyImage
								src={`/assets/icons/bible/58/${serverLanguageTag}.png`}
								width='48px'
								height='48px'
							/>
							<div className='message'>
								{ message }
							</div>
						</div>
					}
					confirmPrompt={<FormattedMessage id='sure!' />}
					cancelPrompt={<FormattedMessage id='no thanks' />}
				/>
			</div>
		)

		return (
			<div ref={(prompt) => { this.prompt = prompt }} id='notifications-prompt'>
				<Modal
					ref={(mod) => { this.modal = mod }}
					showBackground={false}
					closeOnOutsideClick={false}
					customClass='yv-drop-shadow white'
					heading={isMobileScreen && promptContent}
				>
					{
						!isMobileScreen
							&& promptContent
					}
				</Modal>
			</div>
		)
	}
}

NotificationsPermissionPrompt.propTypes = {
	auth: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
}

NotificationsPermissionPrompt.defaultProps = {

}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(NotificationsPermissionPrompt)
