import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormField from '../../../../../../app/components/FormField'
import HtmlEditor from '../../../../../../app/components/HtmlEditor'

class ContentTypeText extends Component {

	render() {
		const { contentData, handleChange, intl } = this.props
		return (
			<FormField
				InputType={HtmlEditor}
				name="body"
				placeholder={intl.formatMessage({ id: 'features.EventEdit.features.content.components.ContentTypeText.prompt' })}
				onChange={handleChange}
				value={contentData.body}
				errors={contentData.errors}
			/>
		)
	}
}

ContentTypeText.propTypes = {

}

export default ContentTypeText
