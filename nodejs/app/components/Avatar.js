import React, { PropTypes } from 'react'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'

function Avatar(props) {
	const { placeholderText, customClass, src, width, link, onClick } = props

	const placeholder = (
		<div
			className='yv-avatar avatar-placeholder content-gray vertical-center horizontal-center'
			style={{
				width,
				height: width,
				fontSize: `${width / 2.4}px`
			}}
		>
			{ placeholderText }
		</div>
	)
	const img = (
		<LazyImage
			alt='avatar'
			src={src}
			width={width}
			height={width}
			customClass={`yv-avatar ${customClass}`}
			placeholder={placeholder}
			borderRadius='100%'
		/>
	)

	return (
		(link || typeof onClick === 'function')
		? <a href={link} onClick={onClick} className='yv-avatar-container'>
			{ img }
		</a>
		: <div className='yv-avatar-container'>
			{ img }
		</div>
	)
}

Avatar.propTypes = {
	placeholderText: PropTypes.string,
	customClass: PropTypes.string,
	src: PropTypes.string.isRequired,
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	link: PropTypes.string,
	onClick: PropTypes.func
}

Avatar.defaultProps = {
	placeholderText: '',
	customClass: '',
	width: 48,
	link: null,
	onClick: null
}

export default Avatar
