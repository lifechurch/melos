import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import SectionedLayout from '../components/SectionedLayout'
import SubscriptionList from './SubscriptionList'
import CompletedList from './CompletedList'
import SavedList from './SavedList'
import Routes from '../lib/routes'


class PlansList extends Component {
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
			route: { view },
			auth,
			params,
			serverLanguageTag
		} = this.props

		const username = auth
			&& auth.userData
			&& auth.userData.username
		const language_tag = serverLanguageTag
			|| params.lang
			|| auth.userData.language_tag
			|| 'en'
		let component = null
		let title = <FormattedMessage id='plans.my_plans' />
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
				title = <FormattedMessage id='plans.saved plans' />
				component = (
					<SavedList
						localizedLink={this.localizedLink}
						language_tag={language_tag}
					/>
				)
				backButton = (
					<Link to={this.localizedLink(Routes.subscriptions({ username }))}>
						&larr;
						<FormattedMessage id='plans.back' />
					</Link>
				)

				break
			}
			case 'completed': {
				title = <FormattedMessage id='plans.completed plans' />
				component = (
					<CompletedList
						localizedLink={this.localizedLink}
						language_tag={language_tag}
					/>
				)
				backButton = (
					<Link to={this.localizedLink(Routes.subscriptions({ username }))}>
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
				<div className='large-6 centered' style={{ marginBottom: '15px' }}>
					<SectionedLayout
						left={backButton}
					>
						<div className='plan-saved-title'>{ title }</div>
					</SectionedLayout>
				</div>
				<div className='large-6 medium-8 small-11 centered'>
					<div className='row collapse'>
						{ component }
					</div>
					<div className='row collapse subscription-actions'>
						<div className='left'>
							<Link to={this.localizedLink(Routes.subscriptionsSaved({ username }))}>
								<FormattedMessage id='plans.saved plans' />
							</Link>
						</div>
						<div className='right'>
							<Link to={this.localizedLink(Routes.subscriptionsCompleted({ username }))}>
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
	return {
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
	}
}

PlansList.propTypes = {
	auth: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
}


export default connect(mapStateToProps, null)(PlansList)
