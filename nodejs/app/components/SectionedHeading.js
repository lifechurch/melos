import React, { PropTypes } from 'react'

function SectionedHeading({ className, left, right, children }) {
	return (
		<div className={`yv-sectioned-heading ${className}`} >
			<div className="yv-left">
				{left}
			</div>
			<div className="yv-center">
				{children}
			</div>
			<div className="yv-right">
				{right}
			</div>
		</div>
	)
}

SectionedHeading.propTypes = {
	className: PropTypes.string,
	left: PropTypes.node,
	right: PropTypes.node,
	children: PropTypes.node
}

SectionedHeading.defaultProps = {
	className: '',
	left: null,
	right: null,
	children: null
}

export default SectionedHeading
