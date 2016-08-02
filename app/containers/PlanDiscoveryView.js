import React, { Component } from 'react'
import PlanDiscovery from '../features/PlanDiscovery/components/PlanDiscovery'
import { connect } from 'react-redux'

class PlanDiscoveryView extends Component {
	render() {
		return (
			<PlanDiscovery {...this.props} />
		)
	}
}

function mapStateToProps(state) {
	return {
		discover: state.plansDiscovery
	}
}

export default connect(mapStateToProps, null)(PlanDiscoveryView)
