import React, { PropTypes } from 'react'
import SectionedLayout from '../../../components/SectionedLayout'


function build(eleArr) {
	return eleArr.map((el, i) => {
		return (
			<div key={i} className='yv-footer-child' style={{ margin: '0 11px' }}>
				{ el }
			</div>
		)
	})
}

function MomentFooter(props) {
	const { left, right } = props
	const leftDivs = !Array.isArray(left)
		? left
		: build(left)
	const rightDivs = !Array.isArray(right)
		? right
		: build(right)
	return (
		<div className='yv-moment-footer'>
			<SectionedLayout
				left={leftDivs}
				right={rightDivs}
			/>
		</div>
	)
}

MomentFooter.propTypes = {
	left: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
	right: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
}

MomentFooter.defaultProps = {
	left: null,
	right: null,
}

export default MomentFooter
