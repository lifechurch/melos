import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'

class App extends Component {
	render() {
		const { children } = this.props
		return (
			<div>
				{children}
			</div>
		)
	}
}

App.propTypes = {
	children: PropTypes.node
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	}
}

export default connect(mapStateToProps, null)(App)