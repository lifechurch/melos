import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'
import HtmlEditor from '../../../../../../app/components/HtmlEditor'
import { FormattedMessage } from 'react-intl'

class ContentTypeAnnouncement extends Component {
	render() {
		const { contentData, handleChange, intl } = this.props
		return (
			<div>
				<div className='form-body-block no-pad white'>
					<FormField
						InputType={Input}
						placeholder={intl.formatMessage({ id: 'features.EventEdit.features.content.components.ContentTypeAnnouncement.title' })}
						name="title"
						onChange={handleChange}
						value={contentData.title}
						errors={contentData.errors}
					/>
				</div>
				<p className='field-caption'>
					<FormattedMessage id="features.EventEdit.features.content.components.ContentTypeAnnouncement.caption" />
				</p>
				<FormField
					InputType={HtmlEditor}
					placeholder={intl.formatMessage({ id: 'features.EventEdit.features.content.components.ContentTypeAnnouncement.prompt' })}
					name="body"
					onChange={handleChange}
					value={contentData.body}
					errors={contentData.errors}
				/>
			</div>
		)
	}
}

ContentTypeAnnouncement.propTypes = {

}

export default ContentTypeAnnouncement
