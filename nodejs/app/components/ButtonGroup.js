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
	className: PropTypes.string,
	buttonWidth: PropTypes.number,
	children: PropTypes.node.isRequired
}

ButtonGroup.defaultProps = {
	className: '',
	buttonWidth: null
}

export default ButtonGroup
