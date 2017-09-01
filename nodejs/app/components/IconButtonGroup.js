import React, { PropTypes } from 'react'

function IconButtonGroup({ children, iconHeight }) {
	return (
		<div className="yv-icon-button-group">
			{children &&
				React.Children.map(children, (child => { return React.cloneElement(child, { iconHeight }) }))
			}
		</div>
	)
}

IconButtonGroup.propTypes = {
	children: PropTypes.node.isRequired,
	iconHeight: PropTypes.number
}

IconButtonGroup.defaultProps = {
	iconHeight: 20
}

export default IconButtonGroup
