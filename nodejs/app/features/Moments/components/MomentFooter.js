import React, { PropTypes } from 'react'
import SectionedHeading from '../../../components/SectionedHeading'


function MomentFooter(props) {

	const { left, right } = props

	return (
		<div className='moment-footer'>
			<SectionedHeading
				left={left}
				right={right}
			/>
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
