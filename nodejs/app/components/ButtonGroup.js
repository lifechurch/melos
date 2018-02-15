import React from 'react'
import PropTypes from 'prop-types'

function ButtonGroup({ className, buttonWidth, children }) {
	return (
		<div className={`yv-button-group ${className}`}>
			{
				children
					&& (children.length > 0 || !Array.isArray(children))
					&& React.Children.map(children, (child => {
						if (child) {
							return React.cloneElement(child, {
								width: buttonWidth
							})
						}
						return null
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
