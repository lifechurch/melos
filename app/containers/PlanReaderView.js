import React, { Component } from 'react'
import { connect } from 'react-redux'
import rtlDetect from 'rtl-detect'
import PlanReader from '../features/PlanDiscovery/components/planReader/PlanReader'

class PlanReaderView extends Component {

	localizedLink = (link) => {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	isRtl = () => {
		const { params, serverLanguageTag } = this.props
		const languageTag = params.lang || serverLanguageTag || 'en'
		return rtlDetect.isRtlLang(languageTag)
	}

	render() {
		return (
			<div>
				<PlanReader
					// pass down children components (either ref or devo from route)
					// and location for query params
					{...this.props}
					localizedLink={this.localizedLink}
					isRtl={this.isRtl}
				/>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		plan: state.readingPlans && state.readingPlans.fullPlans && state.readingPlans.fullPlans._SELECTED ? state.readingPlans.fullPlans._SELECTED : {},
		bible: state.bibleReader,
		auth: state.auth,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(PlanReaderView)
