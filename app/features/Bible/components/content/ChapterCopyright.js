import React, { Component, PropTypes } from 'react'

class ChapterCopyright extends Component {
	render() {
		const { copyright, versionId } = this.props
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
				{copyrightElement}
				<a href={`/versions/${versionId}`}>Learn More</a>
			</div>
		)
	}
}

ChapterCopyright.propTypes = {
	copyright: React.PropTypes.object.isRequired,
	versionId: React.PropTypes.number.isRequired
}

export default ChapterCopyright