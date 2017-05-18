import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import rtlDetect from 'rtl-detect'
import Immutable from 'immutable'
import { isVerseOrChapter } from '../lib/readerUtils'
import Passage from '../features/Passage/components/Passage'
import Bible from '../features/Bible/components/Bible'

class ReferenceView extends Component {

	localizedLink = (link) => {
		const { serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	isRtl = () => {
		const { serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || 'en'
		return rtlDetect.isRtlLang(languageTag)
	}

	render() {
		const { params: { splat }, location: { query }, bible } = this.props
		const hasParallel = 'parallel' in query && Immutable.fromJS(bible).hasIn(['parallelVersion', 'id'])
		const { isVerse } = isVerseOrChapter(splat)

		let referenceComponent = (
			<Bible
				{...this.props}
				hasParallel={hasParallel}
				localizedLink={this.localizedLink}
				isRtl={this.isRtl}
			/>
		)

		if (isVerse) {
			referenceComponent = (
				<Passage
					{...this.props}
					isRtl={this.isRtl}
					localizedLink={this.localizedLink}
				/>
			)
		}

		return (
			referenceComponent
		)
	}
}

ReferenceView.propTypes = {
	serverLanguageTag: PropTypes.string,
	params: PropTypes.object,
	location: PropTypes.object,
	bible: PropTypes.object
}

ReferenceView.defaultProps = {
	serverLanguageTag: 'en',
	params: {},
	location: null,
	bible: null
}

function mapStateToProps(state) {
	return {
		passage: (state.passage) ? state.passage : {},
		auth: (state.auth),
		hosts: state.hosts,
		serverLanguageTag: state.serverLanguageTag,
		altVersions: state.altVersions,
		bible: state.bibleReader,
	}
}


export default connect(mapStateToProps, null)(ReferenceView)
