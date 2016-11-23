import React, { Component } from 'react'
import { connect } from 'react-redux'

class PassageView extends Component {
	render() {
		return (
			<h1>Verse Page</h1>
		)
	}
}

function mapStateToProps(state) {
	return {
		readingPlans: state.readingPlans ? state.readingPlans : {},
		passage: (state.passage) ? state.passage : {},
		auth: (state.auth)
	}
}

export default connect(mapStateToProps, null)(PassageView)