import React, { Component } from 'react'
import { connect } from 'react-redux'
import PlanComponent from '../features/PlanDiscovery/components/Plan'

class Plan extends Component {
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
			<PlanComponent {...this.props} localizedLink={::this.localizedLink} isRtl={::this.isRtl} >
				{!!this.props.children && React.cloneElement(this.props.children, { localizedLink: ::this.localizedLink, isRtl: ::this.isRtl })}
			</PlanComponent>
		)
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
		plan: state.readingPlans.fullPlans._SELECTED,
		hosts: state.hosts
	}
}

export default connect(mapStateToProps, null)(Plan)
