import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import HtmlEditor from '../../../../../../app/components/HtmlEditor'

class ContentTypeText extends Component {

	render() {
		const { contentData, handleChange } = this.props
		return (
			<FormField
				InputType={HtmlEditor}
				name="body"
				onChange={handleChange}
				value={contentData.body}
				errors={contentData.errors} />
		)
	}
}

ContentTypeText.propTypes = {

}

export default ContentTypeText
