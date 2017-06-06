import React, { Component, PropTypes } from 'react'


class CircleProgress extends Component {
	componentDidUpdate() {
		// const now = Date.now()
		// this.refs.path.style.transitionDuration = '0.6s, 0.6s'
		// if (this.prevTimeStamp && now - this.prevTimeStamp < 600) {
		//   this.refs.path.style.transitionDuration = '0s, 0s'
		// }
		// this.prevTimeStamp = Date.now()
	}

	render() {
		const {
			prefixCls, strokeWidth, trailWidth, strokeColor,
			trailColor, strokeLinecap, percent, style, className,
			...restProps,
		} = this.props

		const radius = (50 - strokeWidth / 2)

		const pathString = `M 50,50 m 0,-${radius}
		 a ${radius},${radius} 0 1 1 0,${2 * radius}
		 a ${radius},${radius} 0 1 1 0,-${2 * radius}`

		const len = Math.PI * 2 * radius

		const pathStyle = {
			strokeDasharray: `${len}px ${len}px`,
			strokeDashoffset: `${((100 - percent) / 100 * len)}px`,
			transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease',
		}

		return (
			<svg
				className={`${prefixCls}-circle ${className}`}
				viewBox="0 0 100 100"
				style={style}
				{...restProps}
			>
				<path
					className={`${prefixCls}-circle-trail`}
					d={pathString}
					stroke={trailColor}
					strokeWidth={trailWidth || strokeWidth}
					fillOpacity="0"
				/>

				<path
					className={`${prefixCls}-circle-path`}
					d={pathString}
					strokeLinecap={strokeLinecap}
					stroke={strokeColor}
					strokeWidth={strokeWidth}
					fillOpacity="0"
					ref="path"
					style={pathStyle}
				/>

			</svg>
		)
	}
}

CircleProgress.defaultProps = {
	prefixCls: 'rc-progress',
	strokeWidth: 1,
	strokeColor: '#2db7f5',
	trailWidth: 1,
	trailColor: '#D9D9D9',
	strokeLinecap: 'round',
	className: '',
}

CircleProgress.propTypes = {
	prefixCls: PropTypes.string,
	strokeWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	strokeColor: PropTypes.string,
	trailWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	trailColor: PropTypes.string,
	strokeLinecap: PropTypes.oneOf(['round', 'square']),
	style: PropTypes.object,
	className: PropTypes.string,
}

export default CircleProgress