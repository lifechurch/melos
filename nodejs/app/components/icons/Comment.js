import React from 'react'
import PropTypes from 'prop-types'

function CommentIcon({ width, height, fill }) {
	return (
		<svg className='hearticon' viewBox='0 0 14 14' width={width} height={height} version='1.1' xmlns='http://www.w3.org/2000/svg'>
			<g transform="translate(-5.000000, -5.000000)" fill={fill}>
				<path d="M11.4764473,16.7248692 L10.2288639,18.4521736 L10.2290194,18.4522859 C10.1482384,18.5641289 10.1734191,18.7202814 10.285262,18.8010624 C10.3516786,18.8490333 10.4373961,18.8613876 10.5146561,18.8341246 C16.171552,16.837954 19,14.0599125 19,10.5 C19,7.46243388 15.8659932,5 12,5 C8.13400675,5 5,7.46243388 5,10.5 C5,13.7121074 7.04043357,15.5236688 11.1213007,15.9346841 L11.1212911,15.93478 C11.3959904,15.962447 11.5962497,16.2075635 11.5685826,16.4822628 C11.5597628,16.5698323 11.5279801,16.6535211 11.4764473,16.7248692 Z" />
			</g>
		</svg>
	)
}


CommentIcon.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
}

CommentIcon.defaultProps = {
	width: 14,
	height: 14,
	fill: '#979797',
}

export default CommentIcon



//
//
//
// <svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
//     <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
//     <desc>Created with Sketch.</desc>
//     <defs></defs>
//     <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
//
//     </g>
// </svg>
