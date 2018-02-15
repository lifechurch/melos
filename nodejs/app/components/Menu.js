import React from 'react'
import PropTypes from 'prop-types'

function Menu(props) {
	const { children, customClass, heading, footer } = props
	return (
		<div className={`yv-menu ${customClass}`}>
			{ heading }
			{ children }
			{ footer }
		</div>
	)
}

Menu.propTypes = {
	children: PropTypes.node.isRequired,
	customClass: PropTypes.string,
	heading: PropTypes.node,
	footer: PropTypes.node,
}

Menu.defaultProps = {
	customClass: '',
	heading: null,
	footer: null,
}

export default Menu
