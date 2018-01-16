import React, { PropTypes } from 'react'

function Footer(props) {
	const { customClass, children } = props

	return (
		<div className='sticky-footer'>
			<div className={`medium-8 small-10 vertical-center ${customClass || ''}`}>
				{ children }
			</div>
		</div>
	)
}

Footer.propTypes = {
	customClass: PropTypes.string,
	children: PropTypes.node.isRequired,
}

Footer.defaultProps = {
	customClass: null,
}

export default Footer
