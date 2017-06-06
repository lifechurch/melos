import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { injectIntl } from 'react-intl'

class PlanDiscovery extends Component {
	getCollectionsPage(ids, page) {
		const { dispatch } = this.props
		dispatch(ActionCreators.collectionsItems({ ids, page }))
	}

	render() {
		const { discover, intl, localizedLink, isRtl } = this.props
		const carousels = discover.items.map((c,i) => {
			let nextPageLink = (c.next_page === null) ? null : (<a onClick={this.getCollectionsPage.bind(this, [ c.id ], c.next_page)}>Next Page</a>)

			return (
				<Carousel carouselContent={c} carouselType={c.display} key={i} imageConfig={discover.configuration.images} localizedLink={localizedLink} isRtl={isRtl} />
			)
		})

		return (
			<div>
				<Helmet
					title={`${intl.formatMessage({ id: "plans.title" })}: ${intl.formatMessage({ id: "plans.browse plans" }, { category: intl.formatMessage({ id: "plans.all" })})}`}
					meta={[ { name: 'description', content: `${intl.formatMessage({ id: "plans.title" })}: ${intl.formatMessage({ id: "plans.browse plans" }, { category: intl.formatMessage({ id: "plans.all" })})}` } ]}
				/>
				{carousels}
			</div>
		)
	}
}

export default injectIntl(PlanDiscovery)