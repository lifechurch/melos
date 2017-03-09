import React, { Component } from 'react'
import { connect } from 'react-redux'
import rtlDetect from 'rtl-detect'
import Passage from '../features/Passage/components/Passage'

class PassageView extends Component {

	localizedLink(link) {
		const { serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	isRtl() {
		const { serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || 'en'
		return rtlDetect.isRtlLang(languageTag)
	}

	render() {
		return (
			<Passage {...this.props} isRtl={::this.isRtl} localizedLink={::this.localizedLink} />
		)
	}
}

function mapStateToProps(state) {
	return {
		passage: (state.passage) ? state.passage : {},
		auth: (state.auth),
		serverLanguageTag: state.serverLanguageTag,
		altVersions: state.altVersions
	}
}

export default connect(mapStateToProps, null)(PassageView)
