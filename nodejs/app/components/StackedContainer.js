import React from 'react'
import PropTypes from 'prop-types'


function StackedContainer({
	width,
	height,
	children,
	overrideContainerStyle,
	overrideChildStyle
}) {

	const containerStyle = {
		position: 'relative',
		height: `${height}`,
		overflow: 'hidden',
	}

	const childStyle = {
		width: `${width}`,
		height: `${height}`,
		position: 'absolute',
		left: '0',
		top: '0',
	}

	return (
		<div className='stacked-container' style={overrideContainerStyle || containerStyle}>
			{/* clone each child and add the child style to stack them */}
			{
			React.Children.map(children,
				(child) => {
					return React.cloneElement(child, {
						style: overrideChildStyle || Object.assign({}, childStyle, child.props.style),
						className: `stacked-child ${child.props.className}`
					})
				}
			)
		}
		</div>
	)
}

StackedContainer.propTypes = {
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	children: PropTypes.node.isRequired,
	overrideContainerStyle: PropTypes.object,
	overrideChildStyle: PropTypes.object,
}

StackedContainer.defaultProps = {
	overrideChildStyle: null,
	overrideContainerStyle: null,
}

export default StackedContainer
