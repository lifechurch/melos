import React from 'react'
import { connect } from 'react-redux'
import PlanCollection from '../features/PlanDiscovery/components/PlanCollection'

function PlanCollectionView(props) {
	return (
		<PlanCollection {...props} />
	)
}

function mapStateToProps(state) {
	return {
		imageConfig: (state.plansDiscovery && state.plansDiscovery.configuration && state.plansDiscovery.configuration.images) ? state.plansDiscovery.configuration.images : {},
		collection: (state.plansDiscovery && state.plansDiscovery.collection) ? state.plansDiscovery.collection : { items: [] }
	}
}

export default connect(mapStateToProps, null)(PlanCollectionView)
