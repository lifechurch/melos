import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Textarea from '../../../../../../app/components/Textarea'

class ContentTypeText extends Component {
	render() {
		const { contentData, handleChange } = this.props
		return (
			<div>
				<FormField 
					InputType={Textarea}
					placeholder="Text body"
					name="body"
					onChange={handleChange}
					value={contentData.body}
					errors={contentData.errors} />
			</div>
		)
	}
}

ContentTypeText.propTypes = {

}

export default ContentTypeText