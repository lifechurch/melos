import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../actions/creators'

class PlanDiscovery extends Component {
	getCollectionsPage(ids, page) {
		const { dispatch } = this.props
		dispatch(ActionCreators.collectionsItems({ ids, page }))
	}

	render() {
		const { discover } = this.props

		const carousels = discover.items.map((c,i) => {
			let items = null

			if (Array.isArray(c.items)) {
				items = c.items.map((item, index) => {
					return (<p key={item.id}>{item.title}</p>)
				})
			}

			let nextPageLink = (c.next_page === null) ? null : (<a onClick={this.getCollectionsPage.bind(this, [ c.id ], c.next_page)}>Next Page</a>)

			return (
				<div key={i} className={c.slug}>
					<h1>{c.title}</h1>
					{items}
					{nextPageLink}
				</div>
			)
		})

		return (
			<div>
				<h1>Discovery</h1>
				{carousels}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		discover: state.plansDiscovery
	}
}

export default connect(mapStateToProps, null)(PlanDiscovery)