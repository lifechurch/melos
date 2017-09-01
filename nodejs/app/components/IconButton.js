import React, { PropTypes } from 'react'

function IconButton({ className, label, children, iconHeight }) {
	return (
		<div className={`yv-icon-button ${className}`}>
			<div className="yv-icon-button-svg">
				{children && React.cloneElement(children, { height: iconHeight })}
			</div>
			{label && <div className="yv-icon-button-label">{label}</div>}
		</div>
	)
}

IconButton.propTypes = {
	className: PropTypes.string,
	label: PropTypes.node,
	children: PropTypes.node.isRequired,
	iconHeight: PropTypes.number
}

IconButton.defaultProps = {
	className: '',
	label: null,
	iconHeight: 20
}

export default IconButton
