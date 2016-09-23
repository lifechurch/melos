import React, { Component } from 'react'
import AboutPlan from '../features/PlanDiscovery/components/AboutPlan'
import { connect } from 'react-redux'

class VersePageView extends Component {
	render() {
		return (
			<h1>Verse Page</h1>
		)
	}
}

function mapStateToProps(state) {
	return {
		readingPlans: state.readingPlans ? state.readingPlans : {},
		bible: (state.bible) ? state.bible : {},
		auth: (state.auth)
	}
}

export default connect(mapStateToProps, null)(VersePageView)