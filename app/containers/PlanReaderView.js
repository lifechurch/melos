import React, { Component } from 'react'
import { connect } from 'react-redux'
import PlanReader from '../features/PlanDiscovery/components/planReader/PlanReader'

class PlanReaderView extends Component {
	render() {
		return (
			<div>
				<PlanReader {...this.props}/>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		discover: state.plansDiscovery
	}
}

export default connect(mapStateToProps, null)(PlanReaderView)
