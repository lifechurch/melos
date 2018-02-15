import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card from '../../../../../components/Card'
import Textarea from '../../../../../components/Textarea'

class NoteEditor extends Component {

	componentDidMount() {
		// focus the text area
		if (document.getElementsByName('note-text')) {
			document.getElementsByName('note-text')[0].focus()
		}
	}

	handleChange = (e) => {
		const { updateNote } = this.props

		if (typeof updateNote === 'function') {
			updateNote(e.target.value)
		}
	}

	render() {
		const { intl } = this.props

		return (
			<Card>
				<Textarea
					onChange={this.handleChange}
					placeholder={intl.formatMessage({ id: 'features.EventEdit.features.content.components.ContentTypeAnnouncement.prompt' })}
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
	updateNote: PropTypes.func.isRequired,
}

export default NoteEditor
