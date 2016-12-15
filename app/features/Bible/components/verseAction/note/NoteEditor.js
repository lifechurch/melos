import React, { Component, PropTypes } from 'react'
import Card from '../../../../../components/Card'
import Textarea from '../../../../../components/Textarea'
import LabelSelector from '../bookmark/LabelSelector'

class NoteEditor extends Component {

	componentDidMount() {
		// focus the text area
		if (document.getElementsByName('note-text')) {
			document.getElementsByName('note-text')[0].focus()
		}
	}

	onChange = (e) => {
		const { updateNote } = this.props

   	if (typeof updateNote == 'function') {
   		updateNote(e.target.value)
   	}
	}

	render() {
		const { intl, content } = this.props

		return (
			<Card>
				<Textarea
					value={content}
					onChange={this.onChange}
					placeholder={intl.formatMessage({ id: "features.EventEdit.features.content.components.ContentTypeAnnouncement.prompt" })}
					name='note-text'
					autofocus
					required
				/>
			</Card>
		)
	}
}

/**
 * text field for adding a note
 *
 * @updateNote 		{function} 		callback to update text value
 */
NoteEditor.propTypes = {
	updateNote: React.PropTypes.func,
}

export default NoteEditor