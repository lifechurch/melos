import moment from 'moment'
import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import Image from '../../../components/Carousel/Image'
import SavedPlanListItem from './SavedPlanListItem'
import SubscribedPlanListItem from './SubscribedPlanListItem'
import CompletedPlanListItem from './CompletedPlanListItem'

function PlanListItem(props) {
	const { plan, listType, params, auth, localizedLink, serverLanguageTag } = props
	const language_tag = serverLanguageTag || params.lang || auth.userData.language_tag || 'en'
	let day = moment().diff(moment(plan.start_dt, 'YYYY-MM-DD'), 'days') + 1
	if (day > plan.total_days) {
		day = plan.total_days
	}

	const itemData = {
		languageTag: language_tag,
		plan,
		day
	}

	let planLink = localizedLink(`/reading-plans/${plan.id}-${plan.slug}`)
	let specificListItem
	if (listType === 'Saved') {
		specificListItem = <SavedPlanListItem {...itemData} />
	} else if (listType === 'Subscribed') {
		planLink = localizedLink(`/users/${auth.userData.username}/reading-plans/${plan.id}-${plan.slug}`)
		specificListItem = <SubscribedPlanListItem {...itemData} />
	} else if (listType === 'Completed') {
		specificListItem = <CompletedPlanListItem {...itemData} />
	}

	return (
		<div className="row subscription collapse">
			<div className="small-12 columns">
				<div className="search_thumbnail">
					<Link to={planLink} className="subscription-title">
						<Image className="subscription_thumbnail radius" width={80} height={80} imageId="false" type="about_plan" config={plan} />
					</Link>
				</div>

				<div className="subscription-info">
					<Link to={planLink} className="subscription-title">
						<h3 className="plan-title">{ plan.name[language_tag] || plan.name.default }</h3>
					</Link>
					{specificListItem}
				</div>
			</div>
		</div>
	)
}

PlanListItem.propTypes = {
	plan: PropTypes.object,
	listType: PropTypes.oneOf(['Subscribed', 'Saved', 'Completed']),
	params: PropTypes.object,
	auth: PropTypes.object,
	localizedLink: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string
}

PlanListItem.defaultProps = {
	plan: {},
	listType: 'Subscribed',
	params: {},
	auth: {},
	serverLanguageTag: 'en'
}

export default PlanListItem