import React, { Component } from 'react'
import Immutable from 'immutable'

class CarouselArrow extends Component {
	render() {
		const width = this.props.width || 40
		const height = this.props.height || 40
		const fill = this.props.fill || 'white'
		const dir = this.props.dir || 'right'
		const backColor = this.props.backColor
		const rotation = dir === 'right' ? 0 : 180
		const containerClass = this.props.containerClass || `slick-arrow-${dir}-container`
		const arrowClass = this.props.arrowClass || `slick-arrow-${dir}`
		const thin = typeof this.props.thin === 'undefined' ? true : this.props.thin

		let style = null
		// if background color was passed, set it, else no background (standard carousel)
		if (backColor != null) {
			style = { display: 'flex', backgroundImage: `linear-gradient(${1 * rotation + 90}deg, rgba(0,0,0,0.00) 0%, ${backColor} 100%)` }
		} else {
			style = { display: 'flex' }
		}

		const classes = `vertical-center ${containerClass}`

		const props = Immutable.fromJS(this.props).toJS()
		delete props.containerClass
		delete props.arrowClass
		delete props.currentSlide
		delete props.slideCount
		delete props.backColor

		const points = thin
			? 'M10 17.66l5.12-5.13c.1-.1.1-.26 0-.36L10 7.05c-.19-.19-.19-.5 0-.68 0-.01.01-.01.01-.02l.01-.01c.2-.18.51-.18.7.01L16 11.64c.39.39.39 1.02 0 1.41l-5.3 5.31c-.2.19-.51.19-.7 0-.2-.2-.2-.51 0-.7zm0 0'
			: 'M 9.07,17.44 L 14.4,12.1 14.4,12.1 C 14.6,11.91 14.6,11.59 14.4,11.4 L 9.09,6.08 9.09,6.08 C 8.7,5.7 8.7,5.08 9.09,4.69 L 9.09,4.69 9.09,4.69 C 9.47,4.31 10.09,4.31 10.47,4.69 L 16.85,11.07 16.85,11.07 C 17.24,11.46 17.24,12.09 16.85,12.49 L 10.49,18.85 10.49,18.85 C 10.09,19.24 9.46,19.24 9.07,18.85 L 9.07,18.85 9.07,18.85 C 8.68,18.46 8.68,17.83 9.07,17.44 Z M 9.07,17.44'

		return (
			<div {...this.props} className={classes} style={style} onMouseOver="">
				<svg className={arrowClass} width={width} height={height} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
					<path transform={`rotate(${rotation}, ${width / 2}, ${height / 2})`} stroke="none" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" fill={fill} d={points} />
				</svg>
			</div>
		);
	}
}

export default CarouselArrow
