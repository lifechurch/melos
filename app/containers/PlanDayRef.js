import React, { Component } from 'react'
import { connect } from 'react-redux'

class PlanDayRef extends Component {
	render() {
		return (
			<p>Plan Day Ref</p>
		)
	}
}

function mapStateToProps(state) {
	return {
		discover: state.plansDiscovery
	}
}

export default connect(mapStateToProps, null)(PlanDayRef)
