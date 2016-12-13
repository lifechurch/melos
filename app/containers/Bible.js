import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../features/Bible/actions/creators'
import Bible from '../features/Bible/components/Bible'
import BibleSandbox from '../features/Bible/components/BibleSandbox'


class BibleView extends Component {

						// <BibleSandbox {...this.props} />
	render() {
		return (
			<div>
				<div className="">
					<div className="">
						<BibleSandbox {...this.props} />
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		bible: state.bibleReader,
		hosts: state.hosts
	}
}

export default connect(mapStateToProps, null)(BibleView)
