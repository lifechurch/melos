import React, { Component, PropTypes } from 'react'
import ColorList from './ColorList'
import { FormattedMessage, injectIntl } from 'react-intl'
import ButtonBar from '../../../../components/ButtonBar'
import DropdownTransition from '../../../../components/DropdownTransition'
import TriggerButton from '../../../../components/TriggerButton'
import ShareWidget from './share/Share'
import CopyToClipboard from 'react-copy-to-clipboard'
import ActionCreators from '../../actions/creators'
// import moment from 'moment'
import MomentCreate from './MomentCreate'

class VerseAction extends Component {
	constructor(props) {
		super(props)
		this.state = { verseCopied: false, isOpen: false, momentContainerOpen: false, momentKind: 'bookmark' }
		this.handleActionClick = ::this.handleActionClick
		this.handleClose = ::this.handleClose
		this.handleHighlight = ::this.handleHighlight
		this.openMe = ::this.openMe
		this.closeMe = ::this.closeMe
		this.handleMomentContainerClose = ::this.handleMomentContainerClose
	}

	handleActionClick(e) {
		const { colors, dispatch, auth, selection: { verses }, bible: { version: { id, local_abbreviation } } } = this.props

		// if we're not logged in and try to make an auth'd moment
		if (!auth.isLoggedIn && (e.value == 'note' || e.value == 'bookmark')) {
			this.setState({
				momentContainerOpen: !this.state.momentContainerOpen,
				momentKind: e.value,
			})
		} else {
			switch (e.value) {
				case 'note':
				case 'bookmark':
					dispatch(ActionCreators.bibleVerses({
						id: id,
						references: verses,
						format: 'html',
						local_abbreviation: local_abbreviation
					}))
					this.setState({ momentKind: e.value, momentContainerOpen: !this.state.momentContainerOpen })
					return
			}
		}

	}

	handleMomentContainerClose(closeVerseAction=false) {
		this.setState({ momentContainerOpen: false })
		if (closeVerseAction) {
			this.handleClose()
		}
	}

	closeMe() {
		this.container.classList.remove('open')
	}

	openMe() {
		this.container.classList.add('open')
	}

	handleClose() {
		const { onClose } = this.props
		this.setState({ momentContainerOpen: false })
		if (typeof onClose === 'function') {
			onClose()
		}
	}

	handleHighlight(color, deleteHighlight=false) {
		const { selection: { verses, version }, dispatch, auth } = this.props
		const references = [{ usfm: verses, version_id: version }]

		// tell the moment create what kind of message to display for having a user
		// log in, if they aren't already
		if (!auth.isLoggedIn) {
			this.setState({ momentKind: 'highlight', momentContainerOpen: !this.state.momentContainerOpen })
		} else {
			dispatch(ActionCreators.momentsCreate(true, {
				kind: 'highlight',
				references: references,
				color: color.replace('#', ''),
				created_dt: new Date().toISOString().split('.')[0] + "+00:00"
			}))
			this.handleClose({})
		}
	}

	deleteColor = (color) => {
		const { selection: { verses, version }, dispatch, verseColors } = this.props
		let versesToDelete = []
		// don't delete colors from every verse selected,
		// only the verses that match the color x that was clicked
		verses.forEach((selectedVerse) => {
			verseColors.forEach((colorVerse) => {
				if (selectedVerse == colorVerse[0] && colorVerse[1] == color) {
					versesToDelete.push(selectedVerse)
				}
			})
		})
		// delete the verse color and then update verseColors for chapter
		dispatch(ActionCreators.hideVerseColors(true, {
			usfm: versesToDelete,
			version_id: version,
		})).then(() => {
			dispatch(ActionCreators.momentsVerseColors(true, { usfm: verses[0].split('.').slice(0,2).join('.'), version_id: version })).then((newVerseColors) => {
				this.handleClose()
			})

		})
	}

	componentWillReceiveProps(nextProps) {
		const { selection: { human } } = nextProps
		if (!(typeof human === 'string' && human.length > 0)) {
			setTimeout(this.closeMe, 100)
			setTimeout(() => { this.forceUpdate() }, 1000)
		}
	}

	shouldComponentUpdate(nextProps) {
		const { selection: { human: nextHuman } } = nextProps
		const { selection: { human: currHuman } } = this.props

		const shouldIUpdate = nextHuman !== currHuman && typeof nextHuman !== 'undefined' && nextHuman.length > 0

		if (shouldIUpdate && (typeof currHuman === 'undefined' || currHuman.length === 0)) {
			setTimeout(() => { this.openMe() }, 100)
			setTimeout(() => { this.forceUpdate() }, 1000)
			return false
		} else if (typeof nextHuman === 'undefined' || nextHuman.length === 0) {
			return false
		} else {
			return true
		}
	}

	componentDidUpdate(prevState, prevProps) {
		const { momentContainerOpen } = this.state
		if (momentContainerOpen !== prevState.momentContainerOpen) {
			// stop the body from scrolling behind the moment create
			if (momentContainerOpen) {
				setTimeout(() => {
					document.getElementsByTagName("body")[0].style.position = 'fixed'
				}, 700)
			} else {
				document.getElementsByTagName("body")[0].style.position = 'static'
			}
		}
	}

	render() {
		const { selection: { chapter, human, text, url, verses: selectedReferences }, colors, deletableColors, intl, bible, auth } = this.props
		const { copied, momentContainerOpen, momentKind } = this.state

		const copyAction = (
			<CopyToClipboard
				text={`"${text}"\n\n${chapter}:${human}\n${url}`}
				onCopy={() => {
					this.setState({ copied: true })
					setTimeout(() => {
						this.setState({ copied: false })
					}, 10000)
				}}>
				<span className="yv-green-link">{copied ?
					intl.formatMessage({ id: 'features.EventView.components.EventViewContent.copied' }) :
					intl.formatMessage({ id: 'Reader.verse action.copy' }) }
				</span>
			</CopyToClipboard>
		)

		const actions = [
			{ value: 'share', label: <ShareWidget label={`${chapter}:${human}`} url={url} text={text} /> },
			{ value: 'copy', label: copyAction },
			{ value: 'bookmark', label: <span className="yv-green-link">{intl.formatMessage( { id: 'Reader.verse action.bookmark' })}</span> },
			{ value: 'note', label: <span className="yv-green-link">{intl.formatMessage( { id: 'Reader.verse action.note' })}</span> }
		]

		let colorList
		if (Array.isArray(colors)) {
			colorList = (
				<ColorList
					list={colors}
					onClick={this.handleHighlight}
					deletableColors={deletableColors}
					deleteColor={this.deleteColor}
				/>
			)
		}

		return (
			<div className='verse-action'>
				<div className={`verse-action-footer`} ref={(c) => { this.container = c }}>
					<a onClick={this.handleClose} className="close-button yv-gray-link"><FormattedMessage id="plans.stats.close" /></a>
					<span className="verse-selection" style={{opacity: (chapter && chapter.length && human && human.length) ? 1 : 0 }}>{chapter}:{human}</span>
					<ButtonBar items={actions} onClick={this.handleActionClick} />
					{ colorList }
				</div>
				<DropdownTransition classes='va-moment-container' show={momentContainerOpen} hideDir='down'>
					<MomentCreate
						{...this.props}
						// changing the key will cause a rerender for all children
						// resetting all local state
						key={momentContainerOpen}
						kind={momentKind}
						verses={bible.verses.verses}
						references={bible.verses.references}
						labels={bible.momentsLabels}
						isLoggedIn={auth.isLoggedIn}
						colors={bible.highlightColors}
						onClose={this.handleMomentContainerClose}
					/>
				</DropdownTransition>
			</div>
		)
	}
}

VerseAction.propTypes = {
	selection: PropTypes.any,
	colors: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired
}

export default injectIntl(VerseAction)