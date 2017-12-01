import React, { Component } from 'react'
import { connect } from 'react-redux'
import rtlDetect from 'rtl-detect'
import UnsubbedPlanComponent from '../features/PlanDiscovery/components/UnsubbedPlan'

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
		const { children } = this.props

		return (
			<UnsubbedPlanComponent {...this.props} localizedLink={::this.localizedLink} isRtl={::this.isRtl} >
				{
					children
						&& (children.length > 0 || !Array.isArray(children))
						&& React.cloneElement(children, {
							localizedLink: ::this.localizedLink,
							isRtl: ::this.isRtl
						})
				}
			</UnsubbedPlanComponent>
		)
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
		plan: state.readingPlans.fullPlans._SELECTED,
		savedPlans: state.readingPlans && state.readingPlans.savedPlans ? state.readingPlans.savedPlans : null,
		version: state.bibleReader.version,
		hosts: state.hosts
	}
}

export default connect(mapStateToProps, null)(Plan)