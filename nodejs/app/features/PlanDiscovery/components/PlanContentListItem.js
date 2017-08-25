import React, { PropTypes } from 'react'
import { Link } from 'react-router'

import Circle from '../../../components/Circle'
import CheckMark from '../../../components/CheckMark'


function PlanContentListItem({
	title,
	link,
	isComplete,
	iconStyle,
	handleIconClick
}) {

	return (
		<li className='li-right'>
			{
				handleIconClick
					&& (
						<a tabIndex={0} onClick={handleIconClick}>
							{
								isComplete ?
									<CheckMark fill='#444444' style={iconStyle} /> :
									<Circle style={iconStyle} />
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
	iconStyle: PropTypes.object,
}

PlanContentListItem.defaultProps = {
	iconStyle: {
		padding: '1px 2px 3px 0',
		verticalAlign: 'middle',
		height: 18,
		width: 23,
		cursor: 'pointer'
	}
}

export default PlanContentListItem
