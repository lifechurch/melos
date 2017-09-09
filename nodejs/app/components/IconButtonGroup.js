import React, { PropTypes } from 'react'

function IconButtonGroup({ children, iconHeight, iconSpacing, iconFill, labelColor, labelSize, iconActiveFill, labelActiveColor, alignTo }) {
	const iconStyle = {
		paddingRight: iconSpacing / 2,
		paddingLeft: iconSpacing / 2
	}

	let alignItems = 'flex-end'
	if (alignTo === 'top') {
		alignItems = 'flex-start'
	} else if (alignTo === 'middle') {
		alignItems = 'center'
	}

	return (
		<div className="yv-icon-button-group" style={{ alignItems }}>
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
	labelColor: PropTypes.string,
	labelActiveColor: PropTypes.string,
	labelSize: PropTypes.number,
	alignTo: PropTypes.oneOf(['top', 'middle', 'bottom'])
}

IconButtonGroup.defaultProps = {
	iconHeight: 20,
	iconSpacing: 20,
	iconFill: '#444444',
	iconActiveFill: '#6ab750',
	labelColor: '#444444',
	labelActiveColor: '#6ab750',
	labelSize: 12,
	alignTo: 'bottom'
}

export default IconButtonGroup
