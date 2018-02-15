import React from 'react'
import PropTypes from 'prop-types'
import HeartIcon from './icons/Heart'

function Like(props) {
	const { onLike, isFilled, className, style } = props

	return (
		onLike &&
			<div className={className} style={style}>
				<a tabIndex={0} onClick={onLike}>
					<HeartIcon fill={isFilled ? '#DA1000' : '#979797'} />
				</a>
			</div>
	)
}

Like.propTypes = {
	onLike: PropTypes.func,
	className: PropTypes.string,
	style: PropTypes.object,
	isFilled: PropTypes.bool.isRequired,
}

Like.defaultProps = {
	onLike: null,
	className: '',
	style: { margin: '0 10px 0 10px' },
}

export default Like
