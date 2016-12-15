import React, { Component, PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment-timezone'
import ActionCreators from '../../../actions/creators'
import XMark from '../../../../../components/XMark'
import DropdownTransition from '../../../../../components/DropdownTransition'
import Immutable from 'immutable'
import VerseCard from '../bookmark/VerseCard'
import NoteEditor from './NoteEditor'
import Select from '../../../../../components/Select'
import ColorList from '../ColorList'
import Color from '../Color'

class Note extends Component {
	constructor(props) {
		super(props)
		this.state = {
			verseContent: props.verses,
			references: props.references,
			content: null,
			user_status: 'private',
			selectedColor: null,
			dropdown: false,
		}

		this.USER_STATUS = {
											'private': props.intl.formatMessage({ id: 'notes.status.private' }),
											'public': props.intl.formatMessage({ id: 'notes.status.public' }),
											'friends': props.intl.formatMessage({ id: 'notes.status.friends' }),
											'draft': props.intl.formatMessage({ id: 'notes.status.draft' }),
										}

	}

	componentDidMount() {
		const { isLoggedIn } = this.props
		// redirect to sign in page
		if (!isLoggedIn) {
			window.location.replace('/sign-in')
		}
	}

	componentWillReceiveProps(nextProps) {
		const { verses, references } = this.props
		const { verseContent, refs } = this.state
		// merge in new verses
		if (verses !== nextProps.verses) {
			this.setState({
				verseContent: Immutable.fromJS(verseContent).merge(nextProps.verses).toJS(),
			})
		}
		if (references !== nextProps.references) {
			this.setState({
				references: Immutable.fromJS(references).merge(nextProps.references).toJS(),
			})
		}
	}

	deleteVerse = (key) => {
		const { verseContent, references } = this.state
		if (key in verseContent) {
			this.setState({
				verseContent: Immutable.fromJS(verseContent).delete(key).toJS(),
			})
			// delete from references as well
			references.forEach((ref, index) => {
				if (verseContent[key].usfm[0] == ref.usfm[0]) {
					this.setState({
						references: Immutable.fromJS(references).delete(index).toJS(),
					})
				}
			})
		}
	}

	// note content on keypress
	updateNote = (content) => {
		this.setState({
			content: content,
		})
	}

	changeUserStatus = (key) => {
		this.setState({
			user_status: key,
		})
	}

	saveNote = () => {
		const { dispatch, isLoggedIn } = this.props
		const { content, user_status, references } = this.state
		dispatch(ActionCreators.momentsCreate(isLoggedIn, {
			kind: 'note',
			references: references,
			content: content,
			created_dt: moment().format(),
			user_status: user_status,
		}))
	}

	handleDropdownClick = () => {
		this.setState({
			dropdown: !this.state.dropdown,
		})
	}

	addColor = (color) => {
		this.setState({
			selectedColor: color,
		})
		this.handleDropdownClick()
	}

	render() {
		const { intl, colors } = this.props
		const { verseContent, selectedColor, dropdown } = this.state

		let colorsDiv = null
		if (colors) {
			colorsDiv = (
				<div className='colors-div'>
					<div onClick={this.handleDropdownClick} className='color-trigger-button'>
						{
							selectedColor
							?
							<Color color={selectedColor} />
							:
							<div className='yv-gray-link'><FormattedMessage id='Reader.verse action.add color' /></div>
						}
					</div>
					<DropdownTransition show={dropdown} hideDir='right'>
						<div className='labels-modal'>
							<ColorList list={colors} onClick={this.addColor} />
						</div>
					</DropdownTransition>
				</div>
			)
		}

		return (
			<div className='verse-action-create note-create'>
				<div className='row large-6 medium-9 small-12'>
					<div className='heading vertical-center'>
						<div className='columns medium-4 cancel'><XMark width={18} height={18} /></div>
						<div className='columns medium-4 title'><FormattedMessage id='note' /></div>
						<div className='columns medium-4 save'>
							<div onClick={this.saveNote} className='solid-button green'>Save</div>
						</div>
					</div>
					<VerseCard verseContent={verseContent} deleteVerse={this.deleteVerse}>
						{ colorsDiv }
					</VerseCard>
					<div className='user-status-dropdown'>
						<Select list={this.USER_STATUS} onChange={this.changeUserStatus} />
					</div>
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
 * 																[{ usfm: [], version_id: 59 }]
 */
Note.propTypes = {
	verses: React.PropTypes.object,
	references: React.PropTypes.array,
	isLoggedIn: React.PropTypes.bool,
}

export default injectIntl(Note)