import React, { PropTypes } from 'react'
import moment from 'moment'

function MomentHeader(props) {
	const {
		title,
		dt,
	} = props

	return (
		<div className='yv-moment-header'>
			<div className='title'>
				{ title }
			</div>
			{
				dt &&
				<div className='dt margin-left-auto'>
					{ moment(dt).fromNow() }
				</div>
			}
		</div>
	)
}

MomentHeader.propTypes = {

}

MomentHeader.defaultProps = {

}

export default MomentHeader
