import React, { Component, PropTypes } from 'react'
import Waypoint from 'react-waypoint'


class List extends Component {

	handleLoadMore = () => {
		const { loadMore } = this.props
		if (typeof loadMore === 'function') {
			loadMore()
		}
	}

	render() {
		const { children, customClass } = this.props

		return (
			<ul className={`yv-list ${customClass}`}>
				{ children }
				<Waypoint onEnter={this.handleLoadMore} />
			</ul>
		)
	}
}

List.propTypes = {
	children: PropTypes.node.isRequired,
	loadMore: PropTypes.func,
	customClass: PropTypes.string,
}

List.defaultProps = {
	loadMore: null,
	customClass: '',
}

export default List
