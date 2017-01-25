import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class Plan extends Component {
	render() {
		return (
			<div>
				<p>Plan View</p><br/>
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/edit'}>Settings</Link><br/>
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/calendar'}>Calendar</Link><br/>
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/devo'}>Devo</Link><br/>
				<Link to={'/users/WebsterFancypants/reading-plans/3405-Awakening/ref'}>Ref</Link><br/>
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

export default connect(mapStateToProps, null)(Plan)
