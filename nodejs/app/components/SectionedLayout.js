import React, { PropTypes } from 'react'

function SectionedLayout({ className, style, left, right, children }) {
	return (
		<div className={`yv-sectioned-layout ${className}`} style={style}>
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

SectionedLayout.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	left: PropTypes.node,
	right: PropTypes.node,
	children: PropTypes.node
}

SectionedLayout.defaultProps = {
	className: '',
	style: null,
	left: null,
	right: null,
	children: null
}

export default SectionedLayout
