import React, { Component } from 'react'
import { connect } from 'react-redux'
import Passage from '../features/Passage/components/Passage'

class PassageView extends Component {

	render() {

		return (
			<Passage {...this.props} />
		)
	}
}

function mapStateToProps(state) {
	return {
		passage: (state.passage) ? state.passage : {},
		auth: (state.auth)
	}
}

export default connect(mapStateToProps, null)(PassageView)