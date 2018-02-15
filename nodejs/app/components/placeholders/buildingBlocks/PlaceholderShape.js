import React from 'react'
import PropTypes from 'prop-types'


function PlaceholderShape(props) {
	const {
    fill,
    height,
    borderRadius,
    width,
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
		>
			<svg width={width} height={height}>
				<defs>
					<mask id="mask">
						<rect width="100%" height="100%" fill={fill} />
						{
							parseInt(borderRadius, 10) > 20
								? <circle r={(parseInt(height, 10) || parseInt(width, 10)) / 2} cx='50%' cy='50%' fill='black' />
								: <rect width={width} height={height} rx={borderRadius} ry={borderRadius} />
						}
					</mask>
				</defs>
				<rect width="100%" height="100%" mask="url(#mask)" fill={fill} />
			</svg>
		</div>
	)
}

PlaceholderShape.propTypes = {
	fill: PropTypes.string,
	className: PropTypes.string,
	borderRadius: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

PlaceholderShape.defaultProps = {
	fill: 'white',
	height: '100px',
	width: '100px',
	borderRadius: '0px',
	className: '',
}

export default PlaceholderShape
