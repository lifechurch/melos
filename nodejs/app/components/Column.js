import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Column extends Component {
	render() {
		const { a, s, id, children } = this.props
		return (
			<div id={id} className={`columns ${s} text-${a}`}>
				{children}
			</div>
		)
	}
}

Column.defaultProps = {
	a: 'left'
}

Column.propTypes = {
	s(props, propName, componentName) {
		if (!/(small|medium|large)-(1[0-2]|[1-9]{1})/.test(props[propName])) {
			return new Error('Validation failed!');
		}
	},
	a: PropTypes.oneOf(['left', 'center', 'right'])
}

export default Column
