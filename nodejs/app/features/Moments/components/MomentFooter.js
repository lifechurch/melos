import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import PopupMenu from '../../../components/PopupMenu'
import HeartIcon from '../../../components/Icons/Heart'


function MomentFooter(props) {

	const { onLike, onDelete, onEdit, filledLike } = props

	return (
		<div className='moment-footer'>
			{
				onLike &&
				<div className='margin-right-auto vertical-center' style={{ marginLeft: '10px' }}>
					<a tabIndex={0} onClick={onLike}>
						<HeartIcon fill={filledLike ? '#DA1000' : '#979797'} />
					</a>
				</div>
			}
			{
				(onEdit || onDelete) &&
				<PopupMenu closeButton={null} >
					<ul>
						{
							onEdit &&
							<a tabIndex={0} className='font-grey' onClick={onEdit}>
								<li><FormattedMessage id='edit' /></li>
							</a>
						}
						{
							onDelete &&
							<a tabIndex={0} className='font-grey' onClick={onDelete}>
								<li><FormattedMessage id='delete' /></li>
							</a>
						}
					</ul>
				</PopupMenu>
			}
		</div>
	)
}

MomentFooter.propTypes = {
	onLike: PropTypes.func,
	onDelete: PropTypes.func,
	onEdit: PropTypes.func,
	filledLike: PropTypes.bool,
}

MomentFooter.defaultProps = {
	onLike: null,
	onDelete: null,
	onEdit: null,
	filledLike: null,
}

export default MomentFooter
