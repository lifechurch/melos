import React, { Component, PropTypes } from 'react'
import Waypoint from 'react-waypoint'


class List extends Component {

	handleLoadMore = () => {
		const { loadMore } = this.props
		console.log('pls load more')
		if (loadMore) {
			loadMore()
		}
	}

	render() {
		const { loadMoreDirection, children, customClass, style } = this.props

		let content = (
			<ul className={`yv-list ${customClass}`} style={style}>
				{ children }
				<Waypoint onEnter={this.handleLoadMore} />
			</ul>
		)

		if (loadMoreDirection === 'up') {
			content = (
				<ul className={`yv-list ${customClass}`} style={style}>
					<Waypoint onEnter={this.handleLoadMore} />
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
}

List.defaultProps = {
	loadMore: null,
	customClass: '',
	loadMoreDirection: 'down',
}

export default List
