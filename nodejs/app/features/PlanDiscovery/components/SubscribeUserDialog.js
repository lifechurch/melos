import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'

import getCurrentDT from '../../../lib/getCurrentDT'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import Menu from '../../../components/Menu'
import CarouselArrow from '../../../components/Carousel/CarouselArrow'

class SubscribeUserDialog extends Component {
	constructor(props) {
		super(props)
		this.handleSubscribeUser = this.handleSubscribeUser.bind(this)
	}

	handleSubscribeUser(subscribeContext) {
		const { dispatch, id, isLoggedIn, isSubscribed, subscriptionLink, useRouter } = this.props
		if (!isLoggedIn) window.location.replace('/sign-in')

		switch (subscribeContext) {
			case 'together':
				dispatch(routeActions.push(`${subscriptionLink}/together/create`))
				break
			case 'public':
			case 'private':
				if (!isSubscribed) {
					dispatch(plansAPI.actions.subscriptions.post({}, {
						body: {
							created_dt: getCurrentDT(),
							plan_id: id,
							privacy: subscribeContext,
						},
						auth: isLoggedIn
					})).then(() => {
						if (useRouter) {
							dispatch(routeActions.push(subscriptionLink))
						} else {
							window.location.replace(subscriptionLink)
						}
					})
				} else if (useRouter) {
					dispatch(routeActions.push(subscriptionLink))
				} else {
					window.location.replace(subscriptionLink)
				}
				break
			default:
				break
		}

	}

	render() {
		const { footer } = this.props
		const heading = (
			<h6>How do you want to read this plan?</h6>
		)
		return (
			<Menu
				customClass='subscribe-actions'
				heading={heading}
				footer={footer}
			>
				<ul>
					<li className='vertical-center'>
						<a tabIndex={0} onClick={this.handleSubscribeUser.bind(this, 'public')}>
							<div className='option'>
								<div className='action-title'>By Myself</div>
								<div className='action-description'>Plan Activity is visible by Friends.</div>
							</div>
						</a>
						<CarouselArrow dir='right' containerClass='arrow' fill='gray' width={14} height={14} />
					</li>
					<li className='vertical-center'>
						<a tabIndex={0} onClick={this.handleSubscribeUser.bind(this, 'private')}>
							<div className='option'>
								<div className='action-title'>Private</div>
								<div className='action-description'>Plan Activity is hidden by Friends.</div>
							</div>
						</a>
						<CarouselArrow dir='right' containerClass='arrow' fill='gray' width={14} height={14} />
					</li>
					<li className='vertical-center'>
						<a tabIndex={0} onClick={this.handleSubscribeUser.bind(this, 'together')}>
							<div className='option'>
								<div className='action-title'>With Friends</div>
								<div className='action-description'>Invite some peeps yall.</div>
							</div>
						</a>
						<CarouselArrow dir='right' containerClass='arrow' fill='gray' width={14} height={14} />
					</li>
				</ul>
			</Menu>
		)
	}
}

SubscribeUserDialog.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	dispatch: PropTypes.func.isRequired,
	isSubscribed: PropTypes.bool.isRequired,
	isLoggedIn: PropTypes.bool.isRequired,
	subscriptionLink: PropTypes.string.isRequired,
	useRouter: PropTypes.bool
}

SubscribeUserDialog.defaultProps = {
	useRouter: true,
}

function mapStateToProps(state) {
	return {
		isLoggedIn: state.auth.isLoggedIn,
	}
}

export default connect(mapStateToProps)(SubscribeUserDialog)
