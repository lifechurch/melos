import React, { PropTypes } from 'react'
import Avatar from './Avatar'

function User(props) {
	const {
		avatarLetter,
		src,
		width,
		height,
		link,
		heading,
		subheading,
		onClick,
		children
	} = props

	const avatar = (
		<Avatar placeholderText={avatarLetter} src={src} width={width} height={height} />
	)
	// either render children, or the heading and/or subheading
	const content = (
		children && children.length > 0 ?
			(
				<div className='content'>
					{ children }
				</div>
			) :
			(
				(heading || subheading) &&
				<div className='content'>
					<div className='heading'>{ heading }</div>
					<div className='subheading'>{ subheading }</div>
				</div>
			)
	)

	return (
		(link || onClick) ?
			<a href={link} onClick={onClick} className='yv-user-container'>
				{ avatar }
				{ content }
			</a> :
			<div className='yv-user-container'>
				{ avatar }
				{ content }
			</div>
	)
}

User.propTypes = {
	avatarLetter: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired,
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	link: PropTypes.string,
	onClick: PropTypes.func,
	heading: PropTypes.string,
	subheading: PropTypes.string,
	children: PropTypes.node,
}

User.defaultProps = {
	customClass: '',
	width: 40,
	height: null,
	link: null,
	heading: null,
	subheading: null,
	children: null,
	onClick: null,
}

export default User
