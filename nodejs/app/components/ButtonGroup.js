import React, { PropTypes } from 'react'

function ButtonGroup({ className, buttonWidth, children }) {
	return (
		<div className={`yv-button-group ${className}`}>
			{children &&
				React.Children.map(children, (child => {
					if (child) {
						return React.cloneElement(child, {
							width: buttonWidth
						})
					}
				}))
			}
		</div>
	)
}

ButtonGroup.propTypes = {

}

ButtonGroup.defaultProps = {

}

export default ButtonGroup
