import React from 'react'
import { connect } from 'react-redux'

import PlanSettingsComponent from '../features/PlanDiscovery/components/PlanSettings'

function PlanSettings(props) {
	return (
		<PlanSettingsComponent {...props} />
	)
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		auth: state.auth
	}
}

export default connect(mapStateToProps, null)(PlanSettings)
