import React, { Component, PropTypes } from 'react'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'

class PlansRelatedToReference extends Component {
	componentDidMount() {
		const { usfm, plans, serverLanguageTag, dispatch } = this.props
		if (true) {
			dispatch(readingPlansAction({
				method: 'plans_by_reference',
				params: {
					usfm,
					language_tag: serverLanguageTag,
				}
			}))
		}
	}

	render() {
		// const { } = this.props

		return (
			<div>plans by ref</div>
		)
	}
}

PlansRelatedToReference.propTypes = {

}

PlansRelatedToReference.defaultProps = {

}

export default PlansRelatedToReference
