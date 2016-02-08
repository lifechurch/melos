import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'
import HtmlEditor from '../../../../../../app/components/HtmlEditor'

class ContentTypeAnnouncement extends Component {
	render() {
		const { contentData, handleChange } = this.props
		return (
			<div>
				<FormField 
					InputType={Input}
					placeholder="Announcement Title"
					name="title"
					onChange={handleChange}
					value={contentData.title}
					errors={contentData.errors} />			
				<FormField 
					InputType={HtmlEditor}
					placeholder="Announcement Body"
					name="body"
					onChange={handleChange}
					value={contentData.body}
					errors={contentData.errors} />
			</div>
		)
	}
}

ContentTypeAnnouncement.propTypes = {

}

export default ContentTypeAnnouncement