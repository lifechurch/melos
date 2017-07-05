import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import moment from 'moment'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import participantsView from '@youversion/api-redux/lib/batchedActions/participantsUsersView'
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getTogetherInvitations } from '@youversion/api-redux/lib/models'
import SubscriptionList from './SubscriptionList'
import { selectImageFromList } from '../lib/imageUtil'
import Routes from '../lib/routes'
import List from '../components/List'
import ParticipantsAvatarList from '../widgets/ParticipantsAvatarList'
import TogetherInvitationActions from '../widgets/TogetherInvitationActions'
import ProgressBar from '../components/ProgressBar'
import PlanStartString from '../features/PlanDiscovery/components/PlanStartString'
import PlanListItem from '../features/PlanDiscovery/components/PlanListItem'


class PlansList extends Component {

	componentDidMount() {
		const { dispatch, auth } = this.props
		this.username = (auth && auth.userData && auth.userData.username) ? auth.userData.username : null
		// get any invites we have
		this.getInvitations()
		// get actual subscriptions
		this.getSubs()
		// get completed plans
		dispatch(plansAPI.actions.subscriptions.get({ status: 'completed' }, { auth: true }))
	}

	loadPlanItems = ({ plan_id, together_id }) => {
		const { dispatch, readingPlans } = this.props
		if (!(readingPlans && plan_id in readingPlans.byId)) {
			dispatch(readingPlansAction({
				method: 'view',
				params: {
					id: plan_id,
				},
			}))
		}
		if (together_id) {
			dispatch(participantsView({
				together_id,
				auth: true,
			}))
		}
	}

	render() {
		const { subscriptions, together, invitations, readingPlans, route: { view }, localizedLink, children } = this.props

		let component = null
		const title = ''
		let backButton = null
		switch (view) {
			case 'subscribed': {
				component = (
					<SubscriptionList />
				)
				break
			}
			case 'saved': {
				backButton = (
					<Link to={localizedLink(Routes.subscriptions({ username: this.username }))}>
						&larr;
						<FormattedMessage id='plans.back' />
					</Link>
				)

				break
			}
			case 'completed': {

				backButton = (
					<Link to={localizedLink(Routes.subscriptions({ username: this.username }))}>
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
					<div className='columns large-8 medium-8 medium-centered subscription-list'>
						{ component }
					</div>
				</div>
				<div className='row collapse'>
					<div className='columns large-8 medium-8 medium-centered subscription-actions'>
						<div className='left'>
							<Link to={this.username ? localizedLink(Routes.subscriptionsSaved({ username: this.username })) : null}>
								<FormattedMessage id='plans.saved plans' />
							</Link>
						</div>
						<div className='right'>
							<Link to={this.username ? localizedLink(Routes.subscriptionsCompleted({ username: this.username })) : null}>
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
