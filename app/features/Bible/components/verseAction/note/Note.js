import React, { Component, PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment-timezone'
import ActionCreators from '../../../actions/creators'
import XMark from '../../../../../components/XMark'
import Immutable from 'immutable'
import VerseCard from '../bookmark/VerseCard'
import NoteEditor from './NoteEditor'

class Note extends Component {
	constructor(props) {
		super(props)
		this.state = {
			verseContent: props.verses,
			content: null,
		}

		this.updateNote = this.updateNote.bind(this)
		this.deleteVerse = this.deleteVerse.bind(this)
		this.saveNote = ::this.saveNote
	}

	componentDidMount() {
		const { isLoggedIn } = this.props
		// redirect to sign in page
		if (!isLoggedIn) {
			window.location.replace('/sign-in')
		}
	}

	componentWillReceiveProps(nextProps) {
		const { verses } = this.props
		const { verseContent } = this.state
		// merge in new verses
		if (verses !== nextProps.verses) {
			this.setState({
				verseContent: Immutable.fromJS(verseContent).merge(nextProps.verses).toJS(),
			})
		}
	}

	deleteVerse(key) {
		const { verseContent } = this.state
		if (key in verseContent) {
			this.setState({
				verseContent: Immutable.fromJS(verseContent).delete(key).toJS(),
			})
		}
	}

	// note content on keypress
	updateNote(content) {
		this.setState({
			content: content,
		})
	}

	saveNote() {
		const { dispatch, isLoggedIn, references } = this.props
		const { content } = this.state
		dispatch(ActionCreators.momentsCreate(isLoggedIn, {
			kind: 'note',
			references: references,
			content: content,
			created_dt: moment().format(),
		}))
	}

	render() {
		const { intl } = this.props
		const { verseContent } = this.state

		return (
			<div className='verse-action-create'>
				<div className='row large-6 medium-9 small-12'>
					<div className='heading vertical-center'>
						<div className='columns medium-4 cancel'><XMark width={18} height={18} /></div>
						<div className='columns medium-4 title'><FormattedMessage id='note' /></div>
						<div className='columns medium-4 save'>
							<div onClick={this.saveNote} className='solid-button green'>Save</div>
						</div>
					</div>
					<VerseCard verseContent={verseContent} deleteVerse={this.deleteVerse} />
					<div className='note-editor'>
						<NoteEditor intl={intl} updateNote={this.updateNote} />
					</div>
				</div>
			</div>
		)
	}
}

/**
 * create new note from selected verses
 *
 * @verses				{object} 				verses object containing verse objects. passed to verse card
 * @references		{array}					array of usfms formatted for the momentsCreate API call
 */
Note.propTypes = {
	verses: React.PropTypes.object,
	references: React.PropTypes.array,
}

export default injectIntl(Note)