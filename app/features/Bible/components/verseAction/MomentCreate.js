import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../actions/creators'
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import Immutable from 'immutable'
import XMark from '../../../../components/XMark'
import DropdownTransition from '../../../../components/DropdownTransition'
import VerseCard from './bookmark/VerseCard'
import Card from '../../../../components/Card'
import LabelSelector from './bookmark/LabelSelector'
import NoteEditor from './note/NoteEditor'
import Select from '../../../../components/Select'
import ColorList from './ColorList'
import Color from './Color'
import CustomScroll from 'react-custom-scroll'

class MomentCreate extends Component {

	constructor(props) {
		super(props)
		this.state = {
			localVerses: props.verses || {},
			localRefs: props.references || [],
			content: null,
			user_status: 'private',
			addedLabels: [],
			dropdown: false,
			selectedColor: null,
		}

		this.USER_STATUS = {
			private: props.intl.formatMessage({ id: 'Reader.verse action.private' }),
			public: props.intl.formatMessage({ id: 'Reader.verse action.public' }),
			friends: props.intl.formatMessage({ id: 'Reader.verse action.friends' }),
			draft: props.intl.formatMessage({ id: 'Reader.verse action.draft' }),
		}

	}

	componentWillReceiveProps(nextProps) {
		const { verses, references } = this.props
		const { localVerses, localRefs } = this.state

		// merge in new verses
		if (nextProps.verses && nextProps.references) {
			if (verses !== nextProps.verses) {
				this.setState({
					localVerses: Immutable.fromJS(nextProps.verses).toJS()
				})
			}
			if (references !== nextProps.references) {
				this.setState({
					localRefs: Immutable.fromJS(nextProps.references).toJS()
				})
			}
		}
	}

	/**
	 * handle color picker modal show/hide
	 *
	 */
	handleDropdownClose = () => {
		this.setState({
			dropdown: false,
		})
	}
	handleDropdownOpen = () => {
		this.setState({
			dropdown: true,
		})
	}

	handleClose = () => {
		const { onClose } = this.props
		if (typeof onClose === 'function') {
			onClose(true)
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
		const { localVerses, localRefs } = this.state

		if (key in localVerses) {
			this.setState({
				localVerses: Immutable.fromJS(localVerses).delete(key).toJS(),
			})
			// delete from references as well
			localRefs.forEach((ref, index) => {
				if (localVerses[key].usfm[0] == ref.usfm[0]) {
					this.setState({
						localRefs: Immutable.fromJS(localRefs).delete(index).toJS(),
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
			content,
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
		this.handleDropdownClose()
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
		const { localRefs, addedLabels, content, user_status, selectedColor } = this.state

		dispatch(ActionCreators.momentsCreate(isLoggedIn, {
			kind,
			references: (Array.isArray(localRefs) && localRefs.length > 0) ? localRefs : [],
			labels: (Array.isArray(addedLabels) && addedLabels.length > 0) ? addedLabels : [],
			created_dt: `${new Date().toISOString().split('.')[0]}+00:00`,
			content,
			user_status,
			color: selectedColor ? selectedColor.replace('#', '') : null,
		}))
			.then(data => {
				if (typeof onClose === 'function') {
					onClose(true)
				}
			}, error => {

			}
		)
	}


	render() {
		const { labels, colors, kind, intl, isLoggedIn } = this.props
		const { localVerses, dropdown, selectedColor, content } = this.state

		let labelsDiv, colorsDiv, contentDiv, createHeader = null

		if (!isLoggedIn) {
			let message = ''
			if (kind == 'highlight') {
				message = <FormattedMessage id='Auth.highlight blurb' />
			} else if (kind == 'note') {
				message = <FormattedMessage id='Auth.note blurb' />
			} else if (kind == 'bookmark') {
				message = <FormattedMessage id='Auth.bookmark blurb' />
			}

			contentDiv = (
				<div className='sign-in-required'>
					<Card>
						<div className='heading'><FormattedMessage id='Auth.sign in' /></div>
						<div className='body'>{ message }</div>
						<div className='buttons'>
							<a href='/sign-up' className='solid-button green full'><FormattedMessage id='Auth.sign up' /></a>
							<div className='alt-path terms'><FormattedHTMLMessage id='Auth.sign up alternate' values={{ sign_in_path: '/sign-in' }} /></div>
						</div>
					</Card>
				</div>
			)
		} else {
			if (Array.isArray(colors)) {
				colorsDiv = (
					<div className='colors-div'>
						<div onClick={this.handleDropdownOpen} className='color-trigger-button'>
							{
								selectedColor
								?
									<Color color={selectedColor} />
								:
									<div className='yv-gray-link'><FormattedMessage id='Reader.verse action.add color' /></div>
							}
						</div>
						<DropdownTransition show={dropdown} hideDir='up' onOutsideClick={this.handleDropdownClose} exemptClass='color-trigger-button'>
							<div className='labels-modal'>
								<ColorList list={colors} onClick={this.addColor} />
								<a onClick={this.handleDropdownClose} className="close-button yv-gray-link"><FormattedMessage id="plans.stats.close" /></a>
							</div>
						</DropdownTransition>
					</div>
				)
			}

			// display Bookmark create
			if (kind == 'bookmark' && localVerses) {
				createHeader = <FormattedMessage id='Reader.verse action.bookmark' />
				contentDiv = (
					<div className='bookmark-create'>
						<VerseCard verseContent={localVerses}>
							<div className='small-10'>
								<LabelSelector
									byAlphabetical={labels.byAlphabetical}
									byCount={labels.byCount}
									updateLabels={this.updateLabels}
									intl={intl}
								/>
							</div>
							<div className='small-2'>
								{ colorsDiv }
							</div>
						</VerseCard>
					</div>
				)
			} else if (kind == 'note' && localVerses) {
				createHeader = <FormattedMessage id='Reader.verse action.note' />
				contentDiv = (
					<div className='note-create'>
						<VerseCard verseContent={localVerses} deleteVerse={this.deleteVerse}>
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
		}

		return (
			<div className='verse-action-create'>
				<CustomScroll allowOutsideScroll={false}>
					<div className='row large-6'>
						<div className='heading vertical-center'>
							<div className='columns medium-4 cancel'><XMark onClick={this.handleClose} width={18} height={18} /></div>
							<div className='columns medium-4 title'>{ createHeader }</div>
							<div className='columns medium-4 save'>
								{
									isLoggedIn ?
										<div onClick={this.save} className='solid-button green'>{ intl.formatMessage({ id: 'Reader.verse action.save' }) }</div>
									:
									null
								}
							</div>
						</div>
						{ contentDiv }
					</div>
				</CustomScroll>
			</div>
		)
	}
}

/**
 * create new moment from selected verses (bookmark, note, (image??))
 * highlight is passed if highlight is clicked and not logged in to show message with login
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
	kind: React.PropTypes.oneOf(['bookmark', 'note', 'image', 'highlight']).isRequired,
	verses: React.PropTypes.object,
	references: React.PropTypes.array,
	labels: React.PropTypes.object,
	colors: React.PropTypes.array,
	onClose: React.PropTypes.func,
}

export default injectIntl(MomentCreate)
