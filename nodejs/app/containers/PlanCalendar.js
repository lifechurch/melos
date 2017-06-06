import React from 'react'
import { connect } from 'react-redux'

import PlanCalendarComponent from '../features/PlanDiscovery/components/PlanCalendar'

function PlanCalendar(props) {
	return (
		<PlanCalendarComponent {...props} />
	)
}

function mapStateToProps(state) {
	return {
		plan: state.readingPlans.fullPlans._SELECTED
	}
}

export default connect(mapStateToProps, null)(PlanCalendar)
