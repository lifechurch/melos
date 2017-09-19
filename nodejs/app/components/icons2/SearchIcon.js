import React, { PropTypes } from 'react'

function SearchIcon({ width, height, fill }) {
	return (
		<div className="searchicon-container">
			<svg className='searchicon' viewBox="0 0 15 16" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g transform="translate(-760.000000, -815.000000)">
					<ellipse stroke={fill} fill='transparent' strokeWidth="1.8" cx="766.5" cy="821.5" rx="5.5" ry="5.5" />
					<polygon fill={fill} points="774.080293 831 770 826.955587 771.077063 826 775 829.908309" />
				</g>
			</svg>
		</div>
	)
}


SearchIcon.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	fill: PropTypes.string,
}

SearchIcon.defaultProps = {
	width: 8,
	height: 8,
	fill: '#979797',
}

export default SearchIcon
