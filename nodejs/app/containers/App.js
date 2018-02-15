import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function App(props) {
	const { children } = props
	return (
		<div>
			{ children }
		</div>
	)
}

App.propTypes = {
	children: PropTypes.node.isRequired
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	}
}

export default connect(mapStateToProps, null)(App)
