import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import CustomScroll from 'react-custom-scroll'
import SectionedLayout from '@youversion/melos/dist/components/layouts/SectionedLayout'
import ActionCreators from '../../actions/creators'
import DropdownTransition from '../../../../components/DropdownTransition'
import VerseCard from '../../../../components/VerseCard'
import Card from '../../../../components/Card'
import LabelSelector from './bookmark/LabelSelector'
import NoteEditor from './note/NoteEditor'
import Select from '../../../../components/Select'
import ColorList from './ColorList'
import Color from './Color'

class MomentCreate extends Component {

	constructor(props) {
		super(props)
		this.state = {
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
	 * on Select component change, for selecting privacy options on note
	 *
	 * @param      {string}  key     'private', 'public', 'friends', 'draft'
	 */
	handleChangeUserStatus = ({ key }) => {
		this.setState({
			user_status: key,
		})
	}

	/**
	 * add color to the moment create
	 *
	 * @param      {string}  color   The color selected from the ColorList
	 */
	handleAddColor = (color) => {
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
	handleSave = () => {
		const { dispatch, references, version_id, isLoggedIn, kind, onClose } = this.props
		const { addedLabels, content, user_status, selectedColor } = this.state

		const refs = (Array.isArray(references) && references.length > 0)
			? [{ usfm: references, version_id }]
			: []

		dispatch(ActionCreators.momentsCreate(isLoggedIn, {
			kind,
			references: refs,
			labels: (Array.isArray(addedLabels) && addedLabels.length > 0) ? addedLabels : [],
			created_dt: `${new Date().toISOString().split('.')[0]}+00:00`,
			content,
			user_status,
			color: selectedColor ? selectedColor.replace('#', '') : null,
		}))
			.then(() => {
				if (typeof onClose === 'function') {
					onClose(true)
				}
			}
		)
	}


	render() {
		const { labels, colors, kind, intl, isLoggedIn, isRtl, human, local_abbreviation, verseContent } = this.props
		const { dropdown, selectedColor } = this.state

		let colorsDiv, contentDiv, createHeader = null

		if (!isLoggedIn) {
			let message = ''
			if (kind === 'highlight') {
				message = <FormattedMessage id='Auth.highlight blurb' />
			} else if (kind === 'note') {
				message = <FormattedMessage id='Auth.note blurb' />
			} else if (kind === 'bookmark') {
				message = <FormattedMessage id='Auth.bookmark blurb' />
			}
			contentDiv = (
				<div className='sign-in-required'>
					<Card>
						<div className='heading'><FormattedHTMLMessage id='Auth.sign in' /></div>
						<div className='body'>{ message }</div>
						<div className='buttons'>
							<a href='/sign-up' className='solid-button green full'><FormattedHTMLMessage id='Auth.sign up' /></a>
							<div className='alt-path terms'><FormattedHTMLMessage id='Auth.sign up alternate' values={{ sign_in_path: '/sign-in' }} /></div>
						</div>
					</Card>
				</div>
			)
		} else {
			if (Array.isArray(colors)) {
				colorsDiv = (
					<div className='colors-div'>
						<a tabIndex={0} onClick={this.handleDropdownOpen} className='color-trigger-button'>
							{
								selectedColor
									? <Color color={selectedColor} />
									: <div className='yv-gray-link'><FormattedMessage id='Reader.verse action.add color' /></div>
							}
						</a>
						<DropdownTransition show={dropdown} hideDir='up' onOutsideClick={this.handleDropdownClose} exemptClass='color-trigger-button'>
							<div className='labels-modal'>
								<ColorList list={colors} onClick={this.handleAddColor} isRtl={isRtl} />
								<a tabIndex={0} onClick={this.handleDropdownClose} className="close-button yv-gray-link">
									<FormattedMessage id="plans.stats.close" />
								</a>
							</div>
						</DropdownTransition>
					</div>
				)
			}

			// display Bookmark create
			if (kind === 'bookmark' && verseContent) {
				createHeader = <FormattedMessage id='Reader.verse action.bookmark' />
				contentDiv = (
					<div className='bookmark-create'>
						<VerseCard
							verseContent={verseContent}
							human={human}
							local_abbreviation={local_abbreviation}
						>
							<div style={{ width: '100%', display: 'flex', alignItems: 'flex-end' }}>
								<div style={{ flex: 1 }}>
									<LabelSelector
										byAlphabetical={labels ? labels.byAlphabetical : null}
										byCount={labels ? labels.byCount : null}
										updateLabels={this.updateLabels}
										intl={intl}
									/>
								</div>
								{ colorsDiv }
							</div>
						</VerseCard>
					</div>
				)
			} else if (kind === 'note' && verseContent) {
				createHeader = <FormattedMessage id='Reader.verse action.note' />
				contentDiv = (
					<div className='note-create'>
						<VerseCard
							verseContent={verseContent}
							human={human}
							local_abbreviation={local_abbreviation}
						>
							{ colorsDiv }
						</VerseCard>
						<div className='user-status-dropdown'>
							<Select list={this.USER_STATUS} onChange={this.handleChangeUserStatus} />
						</div>
						<div className='note-editor'>
							<NoteEditor
								intl={intl}
								updateNote={this.onNoteKeyPress}
							/>
						</div>
					</div>
				)
			}
		}

		return (
			<div className='verse-action-create'>
				<CustomScroll allowOutsideScroll={false}>
					<div className='content large-6 medium-10 small-12'>
						<div className='heading vertical-center'>
							<SectionedLayout
								right={
									<div className='save'>
										{
											isLoggedIn
												? <a tabIndex={0} onClick={this.handleSave} className='solid-button green'>
													{ intl.formatMessage({ id: 'Reader.verse action.save' }) }
												</a>
												: null
										}
									</div>
								}
							>
								<div className='title' style={{ width: '100%' }}>
									{ createHeader }
								</div>
							</SectionedLayout>
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
	kind: PropTypes.oneOf(['bookmark', 'note', 'image', 'highlight']).isRequired,
	verseContent: PropTypes.string,
	references: PropTypes.array,
	labels: PropTypes.object,
	colors: PropTypes.array,
	onClose: PropTypes.func,
	isRtl: PropTypes.bool,
	intl: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

MomentCreate.defaultProps = {
	verseContent: null,
	references: null,
	isRtl: false,
	labels: null,
	colors: null,
	onClose: null,
}

export default injectIntl(MomentCreate)
