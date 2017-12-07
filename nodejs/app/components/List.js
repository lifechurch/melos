import React, { Component, PropTypes } from 'react'
import Waypoint from 'react-waypoint'
import { FormattedMessage } from 'react-intl'


class List extends Component {
	handleLoadMore = () => {
		const { loadMore } = this.props
		if (loadMore) {
			loadMore()
		}
	}

	render() {
		const { loadMoreDirection, children, customClass, style, pageOnScroll, loadMore } = this.props

		const loadMoreButton = loadMore
			&& <a tabIndex={0} onClick={this.handleLoadMore}><FormattedMessage id="more" /></a>

		let content = (
			<ul className={`yv-list ${customClass}`} style={style}>
				{ children }
				{
					pageOnScroll
						? <Waypoint onEnter={this.handleLoadMore} />
						: loadMoreButton
				}
			</ul>
		)

		if (loadMoreDirection === 'up') {
			content = (
				<ul className={`yv-list ${customClass}`} style={style}>
					{
						pageOnScroll
							? <Waypoint onEnter={this.handleLoadMore} />
							: loadMoreButton
					}
					{ children }
				</ul>
			)
		}

		return content
	}
}

List.propTypes = {
	children: PropTypes.node.isRequired,
	loadMore: PropTypes.func,
	customClass: PropTypes.string,
	loadMoreDirection: PropTypes.string,
	style: PropTypes.object,
	pageOnScroll: PropTypes.bool,
}

List.defaultProps = {
	loadMore: null,
	customClass: '',
	loadMoreDirection: 'down',
	style: null,
	pageOnScroll: true,
}

export default List
