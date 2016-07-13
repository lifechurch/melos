import React, { Component } from 'react'
import PlanDiscovery from '../features/PlanDiscovery/components/PlanDiscovery'

class PlanDiscoveryView extends Component {
	render() {
		return (
			<div className="row">
				<div className="columns medium-12">
					<PlanDiscovery />
				</div>
			</div>

		)
	}
}

export default PlanDiscoveryView