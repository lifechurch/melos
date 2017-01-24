import React, { Component, PropTypes } from 'react'
import PlanList from './PlanList'
import ActionCreators from '../actions/creators'
import { FormattedMessage } from 'react-intl'

class SubscribedPlans extends Component {
	constructor(props) {
		super(props)
		this.loadMore = ::this.loadMore
	}

	loadMore(page) {
		const { dispatch, auth: { userData: { userid } } } = this.props
		dispatch(ActionCreators.items({ page: page, user_id: userid }, true))
	}

	render() {
		const { subscribedPlans, params, auth, localizedLink, serverLanguageTag } = this.props
		const title = <FormattedMessage id="plans.my plans" />
		return (
			<PlanList
				title={title}
				listType="Subscribed"
				plans={subscribedPlans}
				params={params}
				auth={auth}
				localizedLink={localizedLink}
				loadMore={this.loadMore}
				serverLanguageTag={serverLanguageTag}
			/>
		)
	}
}

SubscribedPlans.propTypes = {

}

SubscribedPlans.defaultProps = {

}

export default SubscribedPlans