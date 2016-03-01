import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Textarea from '../../../../../../app/components/Textarea'
import Input from '../../../../../../app/components/Input'

class ContentTypeLink extends Component {
	render() {
		const { content, handleChange } = this.props

		// For the "giving" type links.
		var kindrid_paragraph;
		if ( content.hasOwnProperty('iamagivinglink') && content.iamagivinglink )
		{
			// JSX voodoo:
			kindrid_paragraph = <p className="giving--kindred-para">If you are looking for a smart, simple giving platform, <a href="https://kindrid.com/">try Kindrid</a>.</p>
		}

		return (
			<div>
				<div className="form-body-block white">
					<FormField
						InputType={Textarea}
						placeholder="Description..."
						name="body"
						onChange={handleChange}
						value={content.data.body}
						errors={content.data.errors} />

					<FormField
						InputType={Input}
						placeholder="Link Label"
						name="title"
						onChange={handleChange}
						value={content.data.title}
						errors={content.data.errors} />

					<FormField
						InputType={Input}
						placeholder="URL"
						name="url"
						onChange={handleChange}
						value={content.data.url}
						errors={content.data.errors} />

					{kindrid_paragraph}
				</div>
			</div>
		)
	}
}

ContentTypeLink.propTypes = {

}

export default ContentTypeLink
