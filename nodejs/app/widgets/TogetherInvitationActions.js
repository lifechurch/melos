import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { getAuth } from '@youversion/api-redux/src/models'
import plansAPI from '@youversion/api-redux/src/endpoints/plans'

class TogetherInvitationActions extends Component {

	handleAction = (action) => {
		const {
			together_id,
			joinToken,
			auth,
			handleActionComplete,
			handleUnauthed,
			dispatch
		} = this.props

		// handle action when unauthed
		if (!auth.isLoggedIn) {
			if (typeof handleUnauthed === 'function') {
				handleUnauthed()
				return
			}
		}
		// handle accept with join token
		if (joinToken) {
			dispatch(plansAPI.actions.participantsJoin.post(
				{ id: together_id },
				{
					body: {
						token: joinToken
					},
					auth: auth.isLoggedIn
				}
			)).then(() => {
				if (typeof handleActionComplete === 'function') {
					handleActionComplete()
				}
			})
		// handle direct invitation accept or decline
		} else if (auth && auth.userData && auth.userData.userid) {
			dispatch(plansAPI.actions.participant.put(
				{ id: together_id, userid: auth.userData.userid },
				{
					body: {
						status: action
					},
					auth: auth.isLoggedIn
				}
			)).then(() => {
				if (typeof handleActionComplete === 'function') {
					handleActionComplete()
				}
			})
		}
	}

	handleAccept = () => {
		this.handleAction('accepted')
	}
	handleDecline = () => {
		this.handleAction('declined')
	}

	render() {
		const { accept, decline, customClass, showDecline } = this.props
		return (
			<div className={`invitation-actions vertical-center ${customClass || ''}`}>
				<a tabIndex={0} onClick={this.handleAccept}>{ accept }</a>
				{
					showDecline &&
					<a tabIndex={0} className='red' onClick={this.handleDecline}>{ decline }</a>
				}
			</div>
		)
	}
}



function mapStateToProps(state) {
	return {
		auth: getAuth(state),
	}
}

TogetherInvitationActions.propTypes = {
	accept: PropTypes.node,
	decline: PropTypes.node,
	showDecline: PropTypes.bool,
	customClass: PropTypes.string,
	handleActionComplete: PropTypes.func,
	handleUnauthed: PropTypes.func,
	auth: PropTypes.object.isRequired,
	joinToken: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	together_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	dispatch: PropTypes.func.isRequired,
}

TogetherInvitationActions.defaultProps = {
	accept: <div className='yv-green-link'><FormattedMessage id='accept invitation' /></div>,
	decline: <div><FormattedMessage id='decline' /></div>,
	showDecline: true,
	customClass: null,
	handleActionComplete: null,
	handleUnauthed: null,
	joinToken: null,
}

export default connect(mapStateToProps, null)(TogetherInvitationActions)
