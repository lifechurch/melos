import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import { Link } from 'react-router'

class PlanDiscovery extends Component {
	getCollectionsPage(ids, page) {
		const { dispatch } = this.props
		dispatch(ActionCreators.collectionsItems({ ids, page }))
	}

	render() {
		const { discover } = this.props
		const carousels = discover.items.map((c,i) => {
			let nextPageLink = (c.next_page === null) ? null : (<a onClick={this.getCollectionsPage.bind(this, [ c.id ], c.next_page)}>Next Page</a>)

			return (
				<Carousel carouselContent={c} carouselType={c.display} key={i} imageConfig={discover.configuration.images}/>
			)
		})

		return (
			<div>
				{carousels}
			</div>
		)
	}
}

export default PlanDiscovery