import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'

import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import getCurrentDT from '../../../lib/getCurrentDT'
import Menu from '../../../components/Menu'
import CarouselArrow from '../../../components/Carousel/CarouselArrow'

class SubscribeUserDialog extends Component {
	constructor(props) {
		super(props)
		this.handleSubscribeUser = this.handleSubscribeUser.bind(this)
	}

	handleSubscribeUser(subscribeContext) {
		const { dispatch, id, isLoggedIn, isSubscribed, subLinkBase, useRouter, serverLanguageTag } = this.props
		if (!isLoggedIn) window.location.replace('/sign-in')

		switch (subscribeContext) {
			case 'together':
				dispatch(routeActions.push(`${subLinkBase}/together/create`))
				break
			case 'public':
			case 'private':
				if (!isSubscribed) {
					dispatch(plansAPI.actions.subscriptions.post({}, {
						body: {
							created_dt: getCurrentDT(),
							plan_id: id,
							privacy: subscribeContext,
							language_tag: serverLanguageTag,
						},
						auth: isLoggedIn
					})).then((data) => {
						if (useRouter) {
							dispatch(routeActions.push(`${subLinkBase}/subscription/${data.id}`))
						} else {
							window.location.replace(`${subLinkBase}/subscription/${data.id}`)
						}
					})
				} else if (useRouter) {
					dispatch(routeActions.push(subLinkBase))
				} else {
					window.location.replace(subLinkBase)
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
					<a tabIndex={0} onClick={this.handleSubscribeUser.bind(this, 'public')}>
						<li className='vertical-center'>
							<div className='option'>
								<div className='action-title'>By Myself</div>
								<div className='action-description'>Plan Activity is visible by Friends.</div>
							</div>
							<CarouselArrow dir='right' containerClass='arrow' fill='gray' width={14} height={14} />
						</li>
					</a>
					<a tabIndex={0} onClick={this.handleSubscribeUser.bind(this, 'private')}>
						<li className='vertical-center'>
							<div className='option'>
								<div className='action-title'>Private</div>
								<div className='action-description'>Plan Activity is hidden by Friends.</div>
							</div>
							<CarouselArrow dir='right' containerClass='arrow' fill='gray' width={14} height={14} />
						</li>
					</a>
					<a tabIndex={0} onClick={this.handleSubscribeUser.bind(this, 'together')}>
						<li className='vertical-center'>
							<div className='option'>
								<div className='action-title'>With Friends</div>
								<div className='action-description'>Invite some peeps yall.</div>
							</div>
							<CarouselArrow dir='right' containerClass='arrow' fill='gray' width={14} height={14} />
						</li>
					</a>
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
	subLinkBase: PropTypes.string.isRequired,
	useRouter: PropTypes.bool
}

SubscribeUserDialog.defaultProps = {
	useRouter: true,
}

function mapStateToProps(state) {
	return {
		isLoggedIn: state.auth.isLoggedIn,
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps)(SubscribeUserDialog)
