import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchEventFeedDiscover, fetchEventFeedMine, fetchEventFeedSaved } from '../actions'
import { Link } from 'react-router'

class App extends Component {
	render() {
		const { children } = this.props
		return (
			<div>
				<Helmet title="This is a title" />				
				{children}
			</div>
		)
	}
}
 
App.propTypes = {
	children: PropTypes.node
}

export default connect()(App)