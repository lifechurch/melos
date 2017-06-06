import React, { PropTypes } from 'react'


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

}

StackedContainer.defaultProps = {
	overrideChildStyle: '',
	overrideContainerStyle: '',
}

export default StackedContainer
