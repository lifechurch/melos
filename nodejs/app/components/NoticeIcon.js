import React, { PropTypes } from 'react'

function NoticeIcon({ children, showNotice, iconHeight, iconFill }) {
	return (
		<div className={`yv-notice-icon yv-notice-icon-${showNotice ? 'on' : 'off'}`}>
			{children && React.cloneElement(children, { height: iconHeight, fill: iconFill })}
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
