import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../features/Bible/actions/creators'
import Bible from '../features/Bible/components/Bible'


class BibleView extends Component {

	render() {
		return (
			<div>
				<div className="row">
					<div className="columns medium-12">
						<Bible {...this.props} />
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		bible: state.bibleReader
	}
}

export default connect(mapStateToProps, null)(BibleView)
