import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getTogetherInvitations } from '@youversion/api-redux/lib/models'
import SubscriptionList from './SubscriptionList'
import CompletedList from './CompletedList'
import Routes from '../lib/routes'


class PlansList extends Component {

	componentDidMount() {
		const { dispatch, auth } = this.props
		this.username = (auth && auth.userData && auth.userData.username) ? auth.userData.username : null
	}

	localizedLink = (link) => {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	render() {
		const {
			subscriptions,
			together,
			invitations,
			readingPlans,
			route: { view },
			auth,
			params,
			serverLanguageTag
		} = this.props

		const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'

		let component = null
		const title = ''
		let backButton = null
		switch (view) {
			case 'subscribed': {
				component = (
					<SubscriptionList
						localizedLink={this.localizedLink}
						language_tag={language_tag}
					/>
				)
				break
			}
			case 'saved': {
				backButton = (
					<Link to={this.localizedLink(Routes.subscriptions({ username: this.username }))}>
						&larr;
						<FormattedMessage id='plans.back' />
					</Link>
				)

				break
			}
			case 'completed': {
				component = (
					<CompletedList
						localizedLink={this.localizedLink}
						language_tag={language_tag}
					/>
				)
				backButton = (
					<Link to={this.localizedLink(Routes.subscriptions({ username: this.username }))}>
						&larr;
						<FormattedMessage id='plans.back' />
					</Link>
				)

				break
			}

			default: return null
		}



		return (
			<div>
				<div className='row collapse'>
					<div className='columns large-8 medium-8 medium-centered'>
						<div className='row collapse plan-title-row'>
							<div className='columns small-2'>
								{ backButton }
							</div>
							<div className='column small-8 end text-center'>
								<div className='plan-saved-title'>{ title }</div>
							</div>
						</div>
					</div>
				</div>
				<div className='row collapse'>
					<div className='columns large-8 medium-8 medium-centered'>
						{ component }
					</div>
				</div>
				<div className='row collapse'>
					<div className='columns large-8 medium-8 medium-centered subscription-actions'>
						<div className='left'>
							<Link to={this.username ? this.localizedLink(Routes.subscriptionsSaved({ username: this.username })) : null}>
								<FormattedMessage id='plans.saved plans' />
							</Link>
						</div>
						<div className='right'>
							<Link to={this.username ? this.localizedLink(Routes.subscriptionsCompleted({ username: this.username })) : null}>
								<FormattedMessage id='plans.completed plans' />
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	console.log('PLANS', getPlansModel(state));
	return {
		subscriptions: getSubscriptionsModel(state),
		readingPlans: getPlansModel(state),
		together: getTogetherModel(state),
		invitations: getTogetherInvitations(state),
		auth: state.auth,
	}
}

PlansList.propTypes = {
	subscriptions: PropTypes.object.isRequired,
	readingPlans: PropTypes.object.isRequired,
	together: PropTypes.object.isRequired,
	invitations: PropTypes.array,
	auth: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

PlansList.defaultProps = {
	invitations: null,
}

export default connect(mapStateToProps, null)(PlansList)
