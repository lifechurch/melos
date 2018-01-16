import React, { PropTypes } from 'react'
import getProportionalSize from '@youversion/utils/lib/images/imageProportions'

function ShareIcon({ width, height, fill, className }) {
	const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
		defaultHeight: ShareIcon.defaultProps.height,
		defaultWidth: ShareIcon.defaultProps.width,
		newHeight: height,
		newWidth: width
	})
	return (
		<svg
			className={className}
			width={finalWidth}
			height={finalHeight}
			viewBox="0 0 14 16"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g transform="translate(-5.000000, -4.000000)" fill={fill}>
				<path fillRule='evenodd' d="M13,7.48017447 L13,15.5 C13,15.7761424 12.7761424,16 12.5,16 L11.5,16 C11.2238576,16 11,15.7761424 11,15.5 L11,7.34825265 L8.76776695,9.5804857 C8.57250481,9.77574785 8.25592232,9.77574785 8.06066017,9.5804857 L8.06066017,9.5804857 L7.35355339,8.87337892 C7.15829124,8.67811677 7.15829124,8.36153428 7.35355339,8.16627214 L7.35355339,8.16627214 L11.2269323,4.29289322 C11.6174566,3.90236893 12.2506216,3.90236893 12.6411459,4.29289322 L16.4748737,8.12662108 C16.6701359,8.32188323 16.6701359,8.63846572 16.4748737,8.83372786 L15.767767,9.54083464 C15.5725048,9.73609679 15.2559223,9.73609679 15.0606602,9.54083464 L13,7.48017447 Z M5.5,12 L6.5,12 L6.5,12 C6.77614237,12 7,12.2238576 7,12.5 L7,17.75 L7,17.75 C7,17.8880712 7.11192881,18 7.25,18 L16.75,18 C16.8880712,18 17,17.8880712 17,17.75 L17,12.5 L17,12.5 C17,12.2238576 17.2238576,12 17.5,12 L18.5,12 C18.7761424,12 19,12.2238576 19,12.5 L19,19.5 C19,19.7761424 18.7761424,20 18.5,20 L5.5,20 C5.22385763,20 5,19.7761424 5,19.5 L5,12.5 C5,12.2238576 5.22385763,12 5.5,12 L5.5,12 Z" />
				<path strokeWidth="2" d="M12,15 L12,15.5 C12,15.2238576 12.2238576,15 12.5,15 L12,15 Z M12,15 L11.5,15 C11.7761424,15 12,15.2238576 12,15.5 L12,15 Z M8.41421356,8.51982553 L8.06066017,8.87337892 C8.25592232,8.67811677 8.57250481,8.67811677 8.76776695,8.87337892 L8.41421356,8.51982553 Z M8.41421356,8.51982553 L8.06066017,8.16627214 C8.25592232,8.36153428 8.25592232,8.67811677 8.06066017,8.87337892 L8.41421356,8.51982553 Z M12,5.06596091 L12,4.93403909 L8.41421356,8.51982553 L11.9340391,5 L12,5.06596091 Z M15.767767,8.83372786 C15.5725048,8.63846572 15.5725048,8.32188323 15.767767,8.12662108 L15.4142136,8.48017447 L15.5909903,8.65695117 L15.4142136,8.48017447 L15.0606602,8.83372786 C15.2559223,8.63846572 15.5725048,8.63846572 15.767767,8.83372786 Z M15.4142136,8.48017447 L14.5606602,7.62662108 L15.4142136,8.48017447 Z M18,13 L18,17.75 C18,18.4403559 17.4403559,19 16.75,19 L7.25,19 C6.55964406,19 6,18.4403559 6,17.75 L6,12.5 C6,12.7761424 6.22385763,13 6.5,13 L6,13 L6,19 L18,19 L18,12.5 C18,12.7761424 18.2238576,13 18.5,13 L18,13 Z" />
			</g>
		</svg>
	)
}


ShareIcon.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
	className: PropTypes.string,
}

ShareIcon.defaultProps = {
	width: 14,
	height: 16,
	fill: 'darkgray',
	className: '',
}

export default ShareIcon
