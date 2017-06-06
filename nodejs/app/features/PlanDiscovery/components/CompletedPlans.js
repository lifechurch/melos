import React, { Component, PropTypes } from 'react'
import PlanList from './PlanList'
import ActionCreators from '../actions/creators'
import { FormattedMessage } from 'react-intl'

class CompletedPlans extends Component {
	constructor(props) {
		super(props)
		this.loadMore = ::this.loadMore
	}

	loadMore(page) {
		const { dispatch, auth: { userData: { userid } } } = this.props
		dispatch(ActionCreators.completed({ page: page, user_id: userid }, true))
	}

	render() {
		const { completedPlans, params, auth, localizedLink, serverLanguageTag } = this.props
		const title = <FormattedMessage id="plans.completed plans" />
		return (
			<PlanList
				title={title}
				listType="Completed"
				plans={completedPlans}
				params={params}
				auth={auth}
				localizedLink={localizedLink}
				loadMore={this.loadMore}
				serverLanguageTag={serverLanguageTag}
			/>
		)
	}
}

CompletedPlans.propTypes = {

}

CompletedPlans.defaultProps = {

}

export default CompletedPlans