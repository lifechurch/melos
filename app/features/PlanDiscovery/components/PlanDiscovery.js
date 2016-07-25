import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'


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
				<div className='row horizontal-center discover-buttons'>
					<ul className='button-group primary-toggle'>
						<li><a className='solid-button green' href='#'>Discover</a></li>
						<li className='inactive'><a className='solid-button green' href='#'>My Plans</a></li>
					</ul>
				</div>
				<div>
					{carousels}
				</div>
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