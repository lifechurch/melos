import React, { PropTypes } from 'react'

function IconButtonGroup({
	children,
	iconHeight,
	iconSpacing,
	iconFill,
	labelColor,
	labelSize,
	iconActiveFill,
	labelActiveColor,
	iconHoverFill,
	labelHoverColor,
	verticalAlign,
	horizontalAlign
}) {
	const iconStyle = {
		paddingRight: iconSpacing / 2,
		paddingLeft: iconSpacing / 2
	}

	let alignItems = 'flex-end'
	if (verticalAlign === 'top') {
		alignItems = 'flex-start'
	} else if (verticalAlign === 'middle') {
		alignItems = 'center'
	}

	let justifyContent = 'flex-start'
	if (horizontalAlign === 'right') {
		justifyContent = 'flex-end'
	} else if (horizontalAlign === 'center') {
		justifyContent = 'center'
	}

	return (
		<div className="yv-icon-button-group" style={{ alignItems, justifyContent }}>
			{children &&
				React.Children.map(children, (child => {
					if (child) {
						return React.cloneElement(child, {
							iconHeight,
							iconFill,
							iconActiveFill,
							labelColor,
							labelSize,
							labelActiveColor,
							iconHoverFill,
							labelHoverColor,
							style: iconStyle
						})
					}
				}))
			}
		</div>
	)
}

IconButtonGroup.propTypes = {
	children: PropTypes.node.isRequired,
	iconHeight: PropTypes.number,
	iconSpacing: PropTypes.number,
	iconFill: PropTypes.string,
	iconActiveFill: PropTypes.string,
	iconHoverFill: PropTypes.string,
	labelColor: PropTypes.string,
	labelActiveColor: PropTypes.string,
	labelHoverColor: PropTypes.string,
	labelSize: PropTypes.number,
	verticalAlign: PropTypes.oneOf(['top', 'middle', 'bottom']),
	horizontalAlign: PropTypes.oneOf(['left', 'center', 'right'])
}

IconButtonGroup.defaultProps = {
	iconHeight: 20,
	iconSpacing: 20,
	iconFill: '#a2a2a2',
	iconActiveFill: '#444444',
	iconHoverFill: '#626262',
	labelColor: '#a2a2a2',
	labelActiveColor: '#444444',
	labelHoverColor: '#626262',
	labelSize: 12,
	verticalAlign: 'bottom',
	horizontalAlign: 'left'
}

export default IconButtonGroup
