import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchEventFeedDiscover } from '../actions'
import { Link } from 'react-router'
import sampleState from '../sampleState'

class Event extends Component {
	componentWillMount() {
		const { dispatch } = this.props
	}

	render() {
		const { ev } = this.props
		return (
			<div>
				<Helmet title="Event" />
				<h1>{ev.title}</h1>
				<p>{ev.description}</p>
			</div>
		)
	}
}

Event.defaultProps = {}
 
function mapStateToProps(state) {
	return {
		ev: sampleState.event
	}
}

export default connect(mapStateToProps, null)(Event)