import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import Circle from '../../../components/Circle'
import CheckMark from '../../../components/CheckMark'


function PlanContentListItem({
	title,
	link,
	isComplete,
	handleIconClick
}) {

	return (
		<li className='li-right vertical-center'>
			{
				handleIconClick
					&& (
						<a
							tabIndex={0}
							onClick={handleIconClick}
							className='vertical-center'
							style={{ marginRight: '5px' }}
						>
							{
								isComplete ?
									<CheckMark fill='#444444' style={{ padding: '0' }} width={18} height={18} /> :
									<Circle
										style={{
											padding: '1px 2px 1px 0',
											height: 17,
											width: 18,
										}}
									/>
							}
						</a>
					)
			}
			<Link to={link}>{ title }</Link>
		</li>
	)
}

PlanContentListItem.propTypes = {
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
	isComplete: PropTypes.bool.isRequired,
	link: PropTypes.string.isRequired,
	handleIconClick: PropTypes.func.isRequired,
}

PlanContentListItem.defaultProps = {

}

export default PlanContentListItem
