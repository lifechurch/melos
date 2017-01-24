import React, { Component, PropTypes } from 'react'
import PlanList from './PlanList'
import ActionCreators from '../actions/creators'
import { FormattedMessage } from 'react-intl'

class SavedPlans extends Component {
	constructor(props) {
		super(props)
		this.loadMore = ::this.loadMore
	}

	loadMore(page) {
		const { dispatch } = this.props
		dispatch(ActionCreators.savedItems({ page: page }, true))
	}

	render() {
		const { savedPlans, params, auth, localizedLink, serverLanguageTag } = this.props
		const title = <FormattedMessage id="plans.saved plans" />
		return (
			<PlanList
				title={title}
				listType="Saved"
				plans={savedPlans}
				params={params}
				auth={auth}
				localizedLink={localizedLink}
				loadMore={this.loadMore}
				serverLanguageTag={serverLanguageTag}
			/>
		)
	}
}

SavedPlans.propTypes = {

}

SavedPlans.defaultProps = {

}

export default SavedPlans