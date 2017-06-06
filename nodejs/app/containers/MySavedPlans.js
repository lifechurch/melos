import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import SavedPlans from '../features/PlanDiscovery/components/SavedPlans'

class MySavedPlans extends Component {
	render() {
		return (
			<SavedPlans {...this.props} />
		)
	}
}

function mapStateToProps(state) {
	return {
		savedPlans: state.readingPlans.savedPlans,
		auth: (state.auth),
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(MySavedPlans)
