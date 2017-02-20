import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

function ChapterCopyright({ copyright, versionId }) {
	let copyrightElement = null

	if (typeof copyright !== 'undefined') {
		if (typeof copyright.html !== 'undefined') {
			const innerContent = { __html: copyright.html }
			copyrightElement = (<div dangerouslySetInnerHTML={innerContent} />)
		} else if (typeof copyright.text !== 'undefined') {
			copyrightElement = (<div>{copyright.text}</div>)
		}
	}

	return (
		<div className="version-copyright">
			{ copyrightElement }
			<a href={`/versions/${versionId}`}><FormattedMessage id="Reader.version.learn more" /></a>
		</div>
	)
}

ChapterCopyright.propTypes = {
	copyright: React.PropTypes.object.isRequired,
	versionId: React.PropTypes.number.isRequired
}

export default ChapterCopyright
