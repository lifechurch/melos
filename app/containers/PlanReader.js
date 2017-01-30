import React, { Component } from 'react'
import { connect } from 'react-redux'

class PlanReader extends Component {
	localizedLink(link) {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	isRtl() {
		const { params, serverLanguageTag } = this.props
		const languageTag = params.lang || serverLanguageTag || 'en'
		return rtlDetect.isRtlLang(languageTag)
	}

	render() {
		return (
			<div>
				<p>Plan Reader</p>
				{this.props.children && React.cloneElement(this.props.children, { localizedLink: ::this.localizedLink, isRtl: ::this.isRtl })}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		discover: state.plansDiscovery
	}
}

export default connect(mapStateToProps, null)(PlanReader)
