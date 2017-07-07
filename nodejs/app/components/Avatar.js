import React, { PropTypes } from 'react'
import LazyImage from './LazyImage'

function Avatar(props) {
	const { placeholderText, customClass, src, width, height, link } = props

	const placeholder = (
		<div
			className='avatar avatar-placeholder content-gray vertical-center horizontal-center'
			style={{ width, height: width || height }}
		>
			{ placeholderText }
		</div>
	)
	const img = (
		<LazyImage
			alt='avatar'
			src={src}
			width={width}
			height={height || width}
			customClass={`avatar ${customClass}`}
			placeholder={placeholder}
		/>
	)

	return (
		link ?
			<a href={link} className='avatar-container'>
				{ img }
			</a> :
			<div className='avatar-container'>
				{ img }
			</div>
	)
}

Avatar.propTypes = {
	placeholderText: PropTypes.string,
	customClass: PropTypes.string,
	src: PropTypes.string.isRequired,
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	link: PropTypes.string,
}

Avatar.defaultProps = {
	placeholderText: '',
	customClass: '',
	width: 48,
	height: null,
	link: null,
}

export default Avatar
