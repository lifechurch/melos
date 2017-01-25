import React, { Component } from 'react'
import { connect } from 'react-redux'

class PlanSettings extends Component {
	render() {
		return (
			<p>Plan Settings</p>
		)
	}
}

function mapStateToProps(state) {
	return {
		discover: state.plansDiscovery
	}
}

export default connect(mapStateToProps, null)(PlanSettings)
