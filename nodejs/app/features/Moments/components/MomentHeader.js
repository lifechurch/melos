import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

function MomentHeader(props) {
	const {
		icon,
		title,
		subTitle,
		dt,
	} = props

	return (
		<div className='yv-moment-header'>
			{
				icon
					&& (
						<div className='aside-col icon vertical-center' style={{ marginRight: '15px' }}>
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
						<div className='dt margin-left-auto' style={{ paddingLeft: '5px' }}>
							{ moment(dt).fromNow(true) }
						</div>
				}
			</div>
		</div>
	)
}

MomentHeader.propTypes = {
	icon: PropTypes.node,
	title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	subTitle: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	dt: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
}

MomentHeader.defaultProps = {
	icon: null,
	title: null,
	subTitle: null,
	dt: null,
}

export default MomentHeader
