import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import PopupMenu from '../../../components/PopupMenu'
import HeartIcon from '../../../components/Icons/Heart'


class MomentFooter extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {

	}

	componentDidUpdate(prevProps, prevState) {

	}

	render() {
		const { onLike, onDelete, onEdit, filledLike, likes } = this.props

		return (
			<div className='moment-footer'>
				{
					onLike &&
					<div className='margin-right-auto vertical-center' style={{ marginLeft: '5px' }}>
						<a tabIndex={0} onClick={onLike}>
							<HeartIcon fill={filledLike ? '#DA1000' : '#979797'} />
						</a>
						{
							likes &&
							<a className='font-grey' style={{ marginLeft: '5px' }}>
								{ likes }
							</a>
						}
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
}

MomentFooter.propTypes = {
	onLike: PropTypes.func,
	onDelete: PropTypes.func,
	onEdit: PropTypes.func,
	filledLike: PropTypes.bool,
	likes: PropTypes.number,
}

MomentFooter.defaultProps = {
	onLike: null,
	onDelete: null,
	onEdit: null,
	filledLike: null,
	likes: null,
}

export default MomentFooter
