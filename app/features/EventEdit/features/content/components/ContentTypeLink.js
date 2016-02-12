import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Textarea from '../../../../../../app/components/Textarea'
import Input from '../../../../../../app/components/Input'

class ContentTypeLink extends Component {
	render() {
		const { contentData, handleChange } = this.props
		return (
			<div>
				<FormField
					InputType={Textarea}
					placeholder="Description..."
					name="body"
					onChange={handleChange}
					value={contentData.body}
					errors={contentData.errors} />

				<FormField
					InputType={Input}
					placeholder="Link Label"
					name="title"
					onChange={handleChange}
					value={contentData.title}
					errors={contentData.errors} />

				<FormField
					InputType={Input}
					placeholder="URL"
					name="url"
					onChange={handleChange}
					value={contentData.url}
					errors={contentData.errors} />
			</div>
		)
	}
}

ContentTypeLink.propTypes = {

}

export default ContentTypeLink
