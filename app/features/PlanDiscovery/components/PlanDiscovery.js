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
			// let items = null

			// if (Array.isArray(c.items)) {
			// 	items = c.items.map((item, index) => {
			// 		return (<p key={item.id}>{item.title}</p>)
			// 	})
			// }

			let nextPageLink = (c.next_page === null) ? null : (<a onClick={this.getCollectionsPage.bind(this, [ c.id ], c.next_page)}>Next Page</a>)

			console.log(`returning carousel${i}`)
			return (
				<Carousel carouselContent={c} carouselType={c.display} key={i} imageConfig={discover.configuration.images}/>
				// <div key={i} className={c.slug}>
					// <h3>{c.title}</h3>
					// {items}
					// {nextPageLink}
				// </div>
			)
		})

		// document.ontouchmove = function(event){
		//     event.preventDefault();
		// }

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