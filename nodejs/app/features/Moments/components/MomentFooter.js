import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
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
					onDelete &&
					<div className='margin-right-auto'>
						{
							onEdit &&
							<a tabIndex={0} className='font-grey' onClick={onEdit} style={{ marginRight: '10px' }}>
								<FormattedMessage id='edit' />
							</a>
						}
						<a tabIndex={0} className='font-grey' onClick={onDelete}>
							<FormattedMessage id='delete' />
						</a>
					</div>
				}
				{
					onLike &&
					<div className='margin-left-auto vertical-center'>
						{
							likes &&
							<a className='font-grey' style={{ marginRight: '5px' }}>
								{ likes }
							</a>
						}
						<a tabIndex={0} onClick={onLike}>
							<HeartIcon fill={filledLike ? '#DA1000' : '#979797'} />
						</a>
					</div>
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
