import React from 'react'
import { connect } from 'react-redux'

import PlanDayComponent from '../features/PlanDiscovery/components/PlanDay'

function PlanDay(props) {
	return (
		<PlanDayComponent {...props} />
	)
}

function mapStateToProps() {
	return {}
}

export default connect(mapStateToProps, null)(PlanDay)
