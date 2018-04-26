import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormField from '../../../../../../app/components/FormField'
import HtmlEditor from '../../../../../../app/components/HtmlEditor'
import Input from '../../../../../../app/components/Input'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

class ContentTypeLink extends Component {
	render() {
		const { content, handleChange, intl } = this.props

		// For the "giving" type links.
		let kindrid_paragraph;
		if (content.hasOwnProperty('iamagivinglink') && content.iamagivinglink)		{
			// JSX voodoo:
			kindrid_paragraph = (<p className="giving--kindred-para">
				<FormattedHTMLMessage id="features.EventEdit.features.content.components.ContentTypeLink.kindrid" values={{ url: 'https://kindrid.com/' }} />
			</p>)
		}

		return (
			<div>
				<div className="form-body-block no-pad white">
					<FormField
						InputType={Input}
						placeholder={intl.formatMessage({ id: 'features.EventEdit.features.content.components.ContentTypeLink.label' })}
						name="title"
						onChange={handleChange}
						value={content.data.title}
						errors={content.data.errors}
					/>
				</div>
				<FormField
					InputType={HtmlEditor}
					placeholder={intl.formatMessage({ id: 'features.EventEdit.features.content.components.ContentTypeLink.prompt' })}
					name="body"
					onChange={handleChange}
					value={content.data.body}
					errors={content.data.errors}
				/>
				<div className="form-body-block no-pad white">
					<FormField
						InputType={Input}
						placeholder={intl.formatMessage({ id: 'features.EventEdit.features.content.components.ContentTypeLink.url' })}
						name="url"
						onChange={handleChange}
						value={content.data.url}
						errors={content.data.errors}
					/>

				</div>
				{kindrid_paragraph}
			</div>
		)
	}
}

ContentTypeLink.propTypes = {

}

export default ContentTypeLink
