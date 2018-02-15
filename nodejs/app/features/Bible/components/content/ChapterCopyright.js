import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

function ChapterCopyright({ content, link, openInNewTab }) {
	return (
		<div className="version-copyright">
			{ content }
			<a target={openInNewTab ? '_blank' : null} href={link}><FormattedMessage id="Reader.version.learn more" /></a>
		</div>
	)
}

ChapterCopyright.propTypes = {
	content: PropTypes.object.isRequired,
	link: PropTypes.string.isRequired,
	openInNewTab: PropTypes.bool
}

ChapterCopyright.defaultProps = {
	content: null,
	link: null,
	openInNewTab: false
}

export default ChapterCopyright
