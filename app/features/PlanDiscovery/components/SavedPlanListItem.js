import React, { Component, PropTypes } from 'react'

class SavedPlanListItem extends Component {
	render() {
		const { plan, languageTag } = this.props
		return (
			<div>
				<div className='plan-length'>
					{ plan.formatted_length[languageTag] || plan.formatted_length.default}
				</div>
			</div>
		)
	}
}

SavedPlanListItem.propTypes = {
	plan: PropTypes.object,
	languageTag: PropTypes.string
}

SavedPlanListItem.defaultProps = {
	plan: {},
	languageTag: 'default'
}

export default SavedPlanListItem