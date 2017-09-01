import React, { PropTypes } from 'react'


function PlaceholderShape(props) {
	const {
    fill,
    background,
    height,
    borderRadius,
    width,
    lineSpacing,
    textHeight,
    className,
  } = props

	return (
		<div
			className={[
				'placeholder-shape',
				`${className}`,
				'vertical-center',
				'flex-wrap'
			].join(' ')}
			style={{ width, height, background, borderRadius, }}
		/>
	)
}

PlaceholderShape.propTypes = {
	fill: PropTypes.string,
	className: PropTypes.string,
	background: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	lineSpacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	textHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

PlaceholderShape.defaultProps = {
	fill: 'white',
	background: null,
	height: '100px',
	width: '100px',
	lineSpacing: '10px',
	textHeight: '17px',
	className: '',
}

export default PlaceholderShape
