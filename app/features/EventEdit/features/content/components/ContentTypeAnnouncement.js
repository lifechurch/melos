import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'
import HtmlEditor from '../../../../../../app/components/HtmlEditor'

class ContentTypeAnnouncement extends Component {
	render() {
		const { contentData, handleChange } = this.props
		return (
			<div>
				<div className='form-body-block no-pad white'>
					<FormField 
						InputType={Input}
						placeholder="Title"
						name="title"
						onChange={handleChange}
						value={contentData.title}
						errors={contentData.errors} />
				</div>
				<p className='field-caption'>In your Event, only your Title (above) will be visible. When a user taps on your Title, the Body (below) displays on a separate screen.</p>
				<FormField 
					InputType={HtmlEditor}
					placeholder="Write something here..."
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
