import React, { PropTypes } from 'react'


function CarouselSlideGradient(props) {
	const { gradient, title } = props

	let style = null
	if (gradient) {
    // configure gradient styling if the carousel has a gradient associated with it
		const colors = []
		for (let i = 0; i < gradient.colors.length; i++) {
      // build color format for linear gradient i.e. #ffff 20%, #efee 50%, ...
			colors.push(`#${gradient.colors[i][0]} ${gradient.colors[i][1] * 100}%`)
		}
		colors.join(' ,')
		style = {
			backgroundImage: `linear-gradient(${gradient.angle}deg, ${colors})`
		}
	} else {
		style = {
			backgroundImage: 'linear-gradient(45deg, #ffff 0%, #eeee 50%, #aaaa 100%)'
		}
	}

	const classes = 'slide vertical-center horizontal-center'
	const titleClasses = 'gradient-title-container title-padding'
	return (
		<div className={classes} style={style}>
			<div className={titleClasses}>{title}</div>
		</div>
	)
}

CarouselSlideGradient.propTypes = {
	gradient: PropTypes.object,
	title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
}

CarouselSlideGradient.defaultProps = {
	gradient: null,
	title: null,
}

export default CarouselSlideGradient
