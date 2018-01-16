import React, { PropTypes } from 'react'


function CarouselSlideTitle(props) {
	const { title } = props

	const classes = 'slide'
	const titleClasses = 'title-padding title-container radius-5'
	return (
		<div className={classes}>
			<div className={titleClasses}>{ title }</div>
		</div>
	)
}

CarouselSlideTitle.propTypes = {
	title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired
}

export default CarouselSlideTitle
