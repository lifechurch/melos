import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../actions/creators'
import { injectIntl, FormattedMessage } from 'react-intl'
import moment from 'moment-timezone'
import Immutable from 'immutable'
import XMark from '../../../../components/XMark'
import DropdownTransition from '../../../../components/DropdownTransition'
import VerseCard from './bookmark/VerseCard'
import LabelSelector from './bookmark/LabelSelector'
import NoteEditor from './note/NoteEditor'
import Select from '../../../../components/Select'
import ColorList from './ColorList'
import Color from './Color'

class MomentCreate extends Component {

	constructor(props) {
		super(props)
		this.state = {
			verseContent: props.verses,
			references: props.references,
			content: null,
			user_status: 'private',
			addedLabels: {},
			dropdown: false,
			selectedColor: null,
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
		const { verses, references } = nextProps
		const { verses:currentVerses, references:currentReferences } = this.props

		if (verses !== currentVerses || references !== currentReferences) {
			this.setState({ verseContent: verses, references })
		}
	}

	/**
	 * handle color picker modal show/hide
	 *
	 */
	handleDropdownClick = () => {
		this.setState({
			dropdown: !this.state.dropdown,
		})
	}

	handleClose = () => {
		const { onClose } = this.props
		if (typeof onClose === 'function') {
			onClose()
		}
	}

	/**
	 * delete verse from moment create. on click of XMark next to verse content
	 * currently only on Note create
	 *
	 * @param      {<type>}  key     The key of the verse to delete
	 *   														 i.e. 59-REV.2.1
	 */
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

	/**
	 * note content on keypress
	 *
	 * @param      {string}  content  keypress value
	 */
	onNoteKeyPress = (content) => {
		this.setState({
			content: content,
		})
	}

	/**
	 * on Select component change, for selecting privacy options on note
	 *
	 * @param      {string}  key     'private', 'public', 'friends', 'draft'
	 */
	changeUserStatus = (key) => {
		this.setState({
			user_status: key,
		})
	}

	/**
	 * add color to the moment create
	 *
	 * @param      {string}  color   The color selected from the ColorList
	 */
	addColor = (color) => {
		this.setState({
			selectedColor: color,
		})
		this.handleDropdownClick()
	}

	/**
	 * update the list of labels added to this moment
	 * called whenever a label is added or deleted in the LabelSelector
	 *
	 * @param      {object}  labels  The labels on the moment
	 */
	updateLabels = (labels) => {
		this.setState({
			addedLabels: Object.keys(labels),
		})
	}

	/**
	 * on save button click. actually creates the moment
	 *
	 * some keys to the api will be null, depending on which kind we are creating
	 */
	save = () => {
		const { dispatch, isLoggedIn, kind, onClose } = this.props
		const { references, addedLabels, content, user_status, selectedColor } = this.state
		dispatch(ActionCreators.momentsCreate(isLoggedIn, {
			kind: kind,
			references: references,
			labels: addedLabels,
			created_dt: moment().format(),
			content: content,
			user_status: user_status,
			color: selectedColor.replace('#', ''),
		})).then(data => {
			if (typeof onClose === 'function') {
				onClose(true)
			}
		}, error => {

		})
	}


	render() {
		const { verses, labels, colors, kind, intl } = this.props
		const { dropdown, selectedColor, verseContent } = this.state

		let labelsDiv, colorsDiv, content, createHeader = null

		if (colors) {
			colorsDiv = (
				<div className='colors-div'>
					<div onClick={this.handleDropdownClick} className='color-trigger-button'>
						{
							selectedColor
							?
							<Color color={selectedColor} />
							:
							<div className='yv-gray-link'><FormattedMessage id='add color' /></div>
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

		// display Bookmark create
		if (kind == 'bookmark') {
			createHeader = <FormattedMessage id='bookmark' />
			content = (
					<VerseCard verseContent={verseContent}>
							<div className='small-10'>
								<LabelSelector byAlphabetical={labels.byAlphabetical} byCount={labels.byCount} updateLabels={this.updateLabels} />
							</div>
							<div className='small-2'>
								{ colorsDiv }
							</div>
					</VerseCard>
			)
		} else if (kind == 'note') {
			createHeader = <FormattedMessage id='note' />
			content = (
				<div className='note-create'>
					<VerseCard verseContent={verseContent} deleteVerse={this.deleteVerse}>
						{ colorsDiv }
					</VerseCard>
					<div className='user-status-dropdown'>
						<Select list={this.USER_STATUS} onChange={this.changeUserStatus} />
					</div>
					<div className='note-editor'>
						<NoteEditor intl={intl} updateNote={this.onNoteKeyPress} />
					</div>
				</div>
			)
		}

		return (
			<div className='verse-action-create'>
				<div className='row large-6'>
					<div className='heading vertical-center'>
						<div className='columns medium-4 cancel'><XMark onClick={this.handleClose} width={18} height={18} /></div>
						<div className='columns medium-4 title'>{ createHeader }</div>
						<div className='columns medium-4 save'>
							<div onClick={this.save} className='solid-button green'>{ intl.formatMessage({ id: "Reader.save"}) }</div>
						</div>
					</div>
					{ content }
				</div>
			</div>
		)
	}
}

/**
 * create new moment from selected verses (bookmark, note, (image??))
 *
 * @kind       				{string}				kind of moment to create
 * @verses						{object} 				verses object containing verse objects. passed to verse card
 * @references				{array}					array of usfms formatted for the momentsCreate API call
 * @labels						{object}				labels object containing an array of labels sorted alphabetically
 * 																		and an array sorted by count
 * @colors 						{array} 				available colors to add to moment
 * @onClose 					{func}					on click of the XMark in header. should close the component
 */
MomentCreate.propTypes = {
	kind: React.PropTypes.oneOf(['bookmark', 'note', 'image']).isRequired,
	verses: React.PropTypes.object,
	references: React.PropTypes.array,
	labels: React.PropTypes.object,
	colors: React.PropTypes.array,
	onClose: React.PropTypes.func,
}

export default injectIntl(MomentCreate)