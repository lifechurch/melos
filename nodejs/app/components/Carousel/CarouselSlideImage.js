import React, { PropTypes } from 'react'


function CarouselSlideImage(props) {
	const { children, title } = props

	return (
		<div>
			<div className='slide-image'>
				{ children }
			</div>
			{
				title
					&& (
						<div className='slide-title'>{ title }</div>
					)
			}
		</div>
	)
}

CarouselSlideImage.propTypes = {
	children: PropTypes.any,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}

CarouselSlideImage.defaultProps = {
	children: null,
	title: null
}

export default CarouselSlideImage
