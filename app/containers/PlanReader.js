import React, { Component } from 'react'
import { connect } from 'react-redux'

class PlanReader extends Component {
	render() {
		return (
			<div>
				<p>Plan Reader</p>
				{this.props.children}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		discover: state.plansDiscovery
	}
}

export default connect(mapStateToProps, null)(PlanReader)
