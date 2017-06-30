import React, { Component, PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import Waypoint from 'react-waypoint'
import { Link } from 'react-router'
import moment from 'moment'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import participantsView from '@youversion/api-redux/lib/batchedActions/participantsUsersView'
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getTogetherInvitations } from '@youversion/api-redux/lib/models'
import { selectImageFromList } from '../../../lib/imageUtil'
import Routes from '../../../lib/routes'
import List from '../../../components/List'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'
import TogetherInvitationActions from '../../../widgets/TogetherInvitationActions'
import ProgressBar from '../../../components/ProgressBar'
import PlanStartString from '../components/PlanStartString'
import PlanListItem from './PlanListItem'


class PlanList extends Component {

	handleLoadMore = () => {
		const { plans: { nextPage }, loadMore } = this.props
		if (nextPage !== null && typeof loadMore === 'function') {
			loadMore(nextPage)
		}
	}



	render() {
		const { planIds, localizedLink } = this.props


		return (
			<List>
				{
					planIds.map((id) => {

					})
				}
			</List>
		)
	}
}

PlanList.propTypes = {
	plans: PropTypes.array.isRequired,
	loadMore: PropTypes.func,
	title: PropTypes.node
}

PlanList.defaultProps = {
	plans: [],
}

export default injectIntl(PlanList)
