import React, { PropTypes } from 'react'
import moment from 'moment'

function MomentHeader(props) {
	const {
		icon,
		title,
		subTitle,
		dt,
	} = props

	return (
		<div className='moment-header'>
			{
				icon
					&& (
						<div className='aside-col icon' style={{ marginRight: '15px' }}>
							{ icon }
						</div>
					)
			}
			<div className='main-col vertical-center'>
				<div className='title'>
					{ title }
				</div>
				{
					subTitle
						&& (
							<div className='sub-title'>
								{ subTitle }
							</div>
						)
				}
				{
					dt &&
						<div className='dt margin-left-auto'>
							{ moment(dt).fromNow() }
						</div>
				}
			</div>
		</div>
	)
}

MomentHeader.propTypes = {

}

MomentHeader.defaultProps = {

}

export default MomentHeader
