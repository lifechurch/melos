import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

function Button({ className, to, useClientRouting, children, width }) {
	return useClientRouting
		? (
			<Link
				style={ width && { width } }
				className={`yv-button ${className}`}
				to={to}
			>
				{ children }
			</Link>
		)
		: (
			<a
				target="_self"
				style={ width && { width } }
				className={`yv-button ${className}`}
				href={to}
			>
				{ children }
			</a>
		)
}

Button.propTypes = {
	className: PropTypes.string,
	to: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
	useClientRouting: PropTypes.bool,
	children: PropTypes.node,
	width: PropTypes.number
}

Button.defaultProps = {
	className: '',
	to: null,
	useClientRouting: true,
	children: null,
	width: null
}

export default Button
