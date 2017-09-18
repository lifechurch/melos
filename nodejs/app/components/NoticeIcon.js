import React, { PropTypes } from 'react'

function NoticeIcon({ children, showNotice, height, fill }) {
	return (
		<div className={`yv-notice-icon yv-notice-icon-${showNotice ? 'on' : 'off'}`}>
			{children && React.cloneElement(children, { height, fill })}
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
