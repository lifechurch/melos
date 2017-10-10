import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Card from '../../../components/Card'
import AvatarList from '../../../widgets/AvatarList'


function Moment(props) {
	const {
		className,
		header,
		children,
		footer,
		likedIds,
		commentIds,
	} = props

	const likes = likedIds && likedIds.length
	const cardFooter = likes
		? (
			<div className='flex-wrap' style={{ width: '100%', padding: '0 17px' }}>
				<AvatarList userids={likedIds} avatarWidth={26} />
				<div className='font-grey margin-left-auto'>
					{
						likes > 1
							? <FormattedMessage id='x likes.other' values={{ number: likedIds.length }} />
							: <FormattedMessage id='x likes.one' values={{ number: likedIds.length }} />
					}
				</div>
			</div>
		)
		: null

	return (
		<Card customClass={`moment-card flex-wrap ${className}`} extension={cardFooter}>
			{ header }
			<div className='main-col'>
				<div className='content'>
					{ children }
				</div>
			</div>
			{ footer }
		</Card>
	)
}

Moment.propTypes = {
	className: PropTypes.string,
	header: PropTypes.node,
	children: PropTypes.node,
	footer: PropTypes.node,
	likedIds: PropTypes.array,
	commentIds: PropTypes.array,
}

Moment.defaultProps = {
	className: '',
	header: null,
	children: null,
	footer: null,
	likedIds: null,
	commentIds: null,
}

export default Moment
