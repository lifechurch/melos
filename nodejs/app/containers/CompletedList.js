import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import getSubscriptionsModel from '@youversion/api-redux/lib/models/subscriptions'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import { selectImageFromList } from '../lib/imageUtil'
import Routes from '../lib/routes'
import List from '../components/List'
import ParticipantsAvatarList from '../widgets/ParticipantsAvatarList'
import PlanListItem from '../features/PlanDiscovery/components/PlanListItem'


class CompletedList extends Component {

	componentDidMount() {
		const { auth, dispatch } = this.props
		this.username = (auth && auth.userData && auth.userData.username) ? auth.userData.username : null
		dispatch(plansAPI.actions.subscriptions.get({ status: 'completed' }, { auth: true })).then((subs) => {
			if (subs && subs.data) {
				const ids = Object.keys(subs.data)
				if (ids.length > 0) {
					ids.forEach((id) => {
						const sub = subs.data[id]
						dispatch(planView({
							plan_id: sub.plan_id,
							together_id: sub.together_id,
							auth,
						}))
					})
				}
			}
		})
	}

	renderListItem = ({ plan_id, together_id, completed_dt, subscription_id = null }) => {
		const {
			language_tag,
			readingPlans,
			localizedLink
		} = this.props
		const plan = (plan_id && plan_id in readingPlans.byId) ? readingPlans.byId[plan_id] : null

		let link, src, subContent
		if (plan && 'id' in plan) {
			src = plan.images ?
						selectImageFromList({ images: plan.images, width: 160, height: 160 }).url :
						null
			link = localizedLink(
				Routes.plan({
					plan_id: plan.id,
					slug: plan.slug
				}))

			subContent = (
				<div>
					<ParticipantsAvatarList
						together_id={together_id}
						showMoreLink={''}
						avatarWidth={26}
					/>
					<div className='plan-length'>
						{
							plan.formatted_length[language_tag] ||
							plan.formatted_length.default
						}
					</div>
					<div className='plan-completed'>
						{ moment(completed_dt).format('LL') }
					</div>
				</div>
			)
		}

		return (
			<PlanListItem
				key={`${plan_id}.${subscription_id}`}
				src={src}
				name={(plan && 'name' in plan) ? (plan.name[language_tag] || plan.name.default) : null}
				link={link}
				subContent={subContent}
			/>
		)
	}


	render() {
		const { subscriptions } = this.props

		const plansList = []
		const completed = subscriptions.getCompleted()
		if (completed && completed.length > 0) {
			completed.forEach((sub) => {
				if (sub && sub.plan_id) {
					plansList.push(this.renderListItem({
						plan_id: sub.plan_id,
						together_id: sub.together_id,
						completed_dt: sub.completed_dt,
						subscription_id: sub.id,
					}))
				}
				return null
			})
		}

		return (
			<List customClass='subscription-list'>
				{
					plansList.length > 0
						? plansList
						: <FormattedMessage id='features.EventEdit.errors.noMatchingPlans' />
				}
			</List>
		)
	}
}

function mapStateToProps(state) {
	return {
		subscriptions: getSubscriptionsModel(state),
		readingPlans: getPlansModel(state),
		auth: state.auth,
	}
}

CompletedList.propTypes = {
	subscriptions: PropTypes.object.isRequired,
	readingPlans: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	language_tag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	localizedLink: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, null)(CompletedList)
