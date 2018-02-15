import React from 'react'
import PropTypes from 'prop-types'

function NoticeIcon({ children, showNotice, height, fill }) {
	return (
		<div className={`yv-notice-icon yv-notice-icon-${showNotice ? 'on' : 'off'}`}>
			{
				children
					&& (children.length > 0 || !Array.isArray(children))
					&& React.cloneElement(children, { height, fill })
				}
		</div>
	)
}

NoticeIcon.propTypes = {
	children: PropTypes.node.isRequired,
	showNotice: PropTypes.bool
}

NoticeIcon.defaultProps = {
	showNotice: false
}

export default NoticeIcon
