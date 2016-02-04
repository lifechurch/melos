import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'

class ContentTypePlan extends Component {
	render() {
		const { contentData, handleChange } = this.props
		return (
			<div>
				<FormField
					InputType={Input}
					placeholder="ID"
					name="plan_id"
					onChange={handleChange}
					value={contentData.plan_id}
					errors={contentData.errors} />

				<FormField
					InputType={Input}
					placeholder="Language Tag"
					name="language_tag"
					onChange={handleChange}
					value={contentData.language_tag}
					errors={contentData.errors} />
			</div>
		)
	}
}

ContentTypePlan.propTypes = {

}

export default ContentTypePlan
