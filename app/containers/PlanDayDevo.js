import React, { Component } from 'react'
import { connect } from 'react-redux'

class PlanDayDevo extends Component {
	render() {
		return (
			<p>Plan Day Devo</p>
		)
	}
}

function mapStateToProps(state) {
	return {
		discover: state.plansDiscovery
	}
}

export default connect(mapStateToProps, null)(PlanDayDevo)
