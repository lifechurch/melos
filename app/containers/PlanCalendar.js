import React, { Component } from 'react'
import { connect } from 'react-redux'

class PlanCalendar extends Component {
	render() {
		return (
			<p>Plan Calendar</p>
		)
	}
}

function mapStateToProps(state) {
	return {
		discover: state.plansDiscovery
	}
}

export default connect(mapStateToProps, null)(PlanCalendar)
