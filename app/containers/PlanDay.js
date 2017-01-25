import React, { Component } from 'react'
import { connect } from 'react-redux'

class PlanDay extends Component {
	render() {
		return (
			<p>Plan Day</p>
		)
	}
}

function mapStateToProps(state) {
	return {
		discover: state.plansDiscovery
	}
}

export default connect(mapStateToProps, null)(PlanDay)
