import React, { PropTypes } from 'react'
import Image from './Carousel/Image'

function AvatarList(props) {
	const { avatarList } = props

	if (!avatarList) return <div />
	const friends = avatarList.map((friend) => {
		return (
			<a href={friend.avatar.action_url}>
				<Image
					className='avatar'
					width={120}
					height={120}
					thumbnail={false}
					imageId='false'
					type='avatar'
					config={friend.avatar.renditions}
				/>
			</a>
		)
	})

	return (
		<div className='avatar-container text-center'>
			{ friends }
		</div>
	)
}

AvatarList.propTypes = {
	avatarList: PropTypes.array,
}

AvatarList.defaultProps = {
	avatarList: null
}

export default AvatarList
