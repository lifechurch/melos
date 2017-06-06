import React, { Component } from 'react'
import PlanCollection from '../features/PlanDiscovery/components/PlanCollection'
import { connect } from 'react-redux'

class PlanCollectionView extends Component {
	render() {
		return (
			<PlanCollection {...this.props} />
		)
	}
}

function mapStateToProps(state) {
	return {
		imageConfig: (state.plansDiscovery && state.plansDiscovery.configuration && state.plansDiscovery.configuration.images) ? state.plansDiscovery.configuration.images : {},
		collection: (state.plansDiscovery && state.plansDiscovery.collection) ? state.plansDiscovery.collection : { items: [] }
	}
}

export default connect(mapStateToProps, null)(PlanCollectionView)