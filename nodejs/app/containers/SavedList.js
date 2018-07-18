import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import plansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import { getAllQueueItems } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import Routes from '@youversion/utils/lib/routes/routes'
import List from '../components/List'
import PlanListItem from '../features/PlanDiscovery/components/PlanListItem'


class SavedList extends Component {

	componentDidMount() {
		const { auth, dispatch, saved, serverLanguageTag } = this.props
		this.username = (auth && auth.userData && auth.userData.username) ? auth.userData.username : null
		if (!saved) {
			dispatch(plansAction({
				method: 'all_queue_items',
				auth: auth.isLoggedIn,
			})).then((response) => {
				if (response && response.reading_plans) {
					const ids = response.reading_plans
					if (ids.length > 0) {
						ids.forEach((id) => {
							dispatch(planView({
								plan_id: id,
								auth,
								serverLanguageTag
							}))
						})
					}
				}
			})
		}
	}

	renderListItem = ({ plan_id }) => {
		const {
			language_tag,
			readingPlans,
			localizedLink
		} = this.props
		const plan = (plan_id && plan_id in readingPlans.byId) ? readingPlans.byId[plan_id] : null

		let link, src, subContent
		if (plan && 'id' in plan) {
			src = plan.images
				? selectImageFromList({ images: plan.images, width: 160, height: 160 }).url
				: null
			link = localizedLink(
				Routes.plan({
					plan_id: plan.id,
					slug: plan.slug
				}))
			subContent = (
				<div className='plan-length'>
					{
						plan.formatted_length[language_tag] ||
						plan.formatted_length.default
					}
				</div>
			)
		}

		return (
			<PlanListItem
				key={plan_id}
				src={src}
				name={(plan && 'name' in plan) ? (plan.name[language_tag] || plan.name.default) : null}
				link={link}
				subContent={subContent}
			/>
		)
	}


	render() {
		const { saved } = this.props

		const plansList = []
		if (saved && saved.length > 0) {
			saved.forEach((id) => {
				if (id) {
					plansList.push(this.renderListItem({
						plan_id: id,
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
		readingPlans: getPlansModel(state),
		saved: getAllQueueItems(state),
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag
	}
}

SavedList.propTypes = {
	readingPlans: PropTypes.object.isRequired,
	saved: PropTypes.array.isRequired,
	auth: PropTypes.object.isRequired,
	language_tag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	localizedLink: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired
}

export default connect(mapStateToProps, null)(SavedList)
