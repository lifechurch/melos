import React, { PropTypes } from 'react'

function NoticeIcon({ children, showNotice }) {
	return (
		<div className={`yv-notice-icon yv-notice-icon-${showNotice ? 'on' : 'off'}`}>
			{children}
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
