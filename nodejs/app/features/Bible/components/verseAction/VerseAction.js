import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import CopyToClipboard from 'react-copy-to-clipboard'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import getCurrentDT from '@youversion/utils/lib/time/getCurrentDT'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'
import ColorList from './ColorList'
import ButtonBar from '../../../../components/ButtonBar'
import FullscreenDrawer from '../../../../components/FullscreenDrawer'
import ShareWidget from './share/Share'
import ActionCreators from '../../actions/creators'
import MomentCreate from './MomentCreate'


class VerseAction extends Component {
	constructor(props) {
		super(props)
		this._isMounted = false
		this.state = { verseCopied: false, isOpen: false, momentContainerOpen: false, momentKind: 'bookmark' }
		this.handleActionClick = ::this.handleActionClick
		this.handleClose = ::this.handleClose
		this.handleHighlight = ::this.handleHighlight
		this.openMe = ::this.openMe
		this.closeMe = ::this.closeMe
	}

	componentDidMount() {
		this._isMounted = true
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	handleActionClick(e) {
		const { dispatch, auth, selection: { usfm }, version: { id, local_abbreviation } } = this.props
		const isMoment = (e.value === 'note' || e.value === 'bookmark')

		if (isMoment) {
			this.setState({
				momentContainerOpen: !this.state.momentContainerOpen,
				momentKind: e.value,
			})
			this.closeMe()
		}
	}

	handleMomentContainerClose = (closeVerseAction = false) => {
		this.setState({ momentContainerOpen: false })
		if (closeVerseAction) {
			this.handleClose()
		}
	}

	closeMe() {
		if (this.container) {
			this.container.classList.remove('open')
		}
	}

	openMe() {
		if (this.container) {
			this.container.classList.add('open')
		}
	}

	handleClose() {
		const { onClose } = this.props
		this.setState({ momentContainerOpen: false })
		if (typeof onClose === 'function') {
			onClose()
		}
	}

	handleHighlight(color) {
		const { selection: { verses, version }, dispatch, auth } = this.props
		const references = [{ usfm: verses, version_id: version }]

		// tell the moment create what kind of message to display for having a user
		// log in, if they aren't already
		if (!(auth && auth.isLoggedIn)) {
			this.setState({ momentKind: 'highlight', momentContainerOpen: !this.state.momentContainerOpen })
			this.closeMe()
		} else {
			dispatch(momentsAction({
				method: 'create',
				params: {
					kind: 'highlight',
					references,
					color: color.replace('#', ''),
					created_dt: getCurrentDT()
				},
				auth: true,
			})).then(() => {
				dispatch(momentsAction({
					method: 'verse_colors',
					params: {
						usfm: chapterifyUsfm(verses[0]),
						version_id: version
					},
					auth: true,
				}))
				this.handleClose()
			})
		}
	}

	deleteColor = (color) => {
		const { selection: { verses, version }, dispatch, verseColors } = this.props
		const versesToDelete = []
		// don't delete colors from every verse selected,
		// only the verses that match the color x that was clicked
		verses.forEach((selectedVerse) => {
			verseColors.forEach((colorVerse) => {
				if (selectedVerse === colorVerse[0] && colorVerse[1] === color) {
					versesToDelete.push(selectedVerse)
				}
			})
		})
		// delete the verse color and then update verseColors for chapter
		dispatch(ActionCreators.hideVerseColors(true, {
			usfm: versesToDelete,
			version_id: version,
		})).then(() => {
			dispatch(momentsAction({
				method: 'verse_colors',
				params: {
					usfm: chapterifyUsfm(verses[0]),
					version_id: version
				},
				auth: true,
			}))
			this.handleClose()
		})
	}

	componentWillReceiveProps(nextProps) {
		const { selection: { human } } = nextProps
		if (!(typeof human === 'string' && human.length > 0)) {
			setTimeout(this.closeMe, 100)
			setTimeout(() => {
				if (this._isMounted) {
					this.forceUpdate()
				}
			}, 1000)
		}
	}

	shouldComponentUpdate(nextProps) {
		const { selection: { human: nextHuman } } = nextProps
		const { selection: { human: currHuman } } = this.props

		const shouldIUpdate = nextHuman !== currHuman && typeof nextHuman !== 'undefined' && nextHuman.length > 0

		if (shouldIUpdate && (typeof currHuman === 'undefined' || currHuman.length === 0)) {
			setTimeout(() => { this.openMe() }, 100)
			setTimeout(() => {
				if (this._isMounted) {
					this.forceUpdate()
				}
			}, 1000)
			return false
		} else if (typeof nextHuman === 'undefined' || nextHuman.length === 0) {
			return false
		} else {
			return true
		}
	}

	render() {
		const {
			selection: { human, text, url, verses: selectedReferences, verseContent },
			deletableColors,
			intl,
			version,
			momentsLabels,
			highlightColors,
			auth,
			isRtl,
		} = this.props
		const { copied, momentContainerOpen, momentKind } = this.state

		const copyAction = (
			<CopyToClipboard
				text={`'${text}'\n\n${human}\n${url}`}
				onCopy={() => {
					this.setState({ copied: true })
					setTimeout(() => {
						this.setState({ copied: false })
					}, 10000)
				}}
			>
				<span className='yv-green-link'>{copied ?
					intl.formatMessage({ id: 'features.EventView.components.EventViewContent.copied' }) :
					intl.formatMessage({ id: 'Reader.verse action.copy' }) }
				</span>
			</CopyToClipboard>
		)

		const actions = [
			{ value: 'share', label: <ShareWidget label={human} url={url} text={text} /> },
			{ value: 'copy', label: copyAction },
			{ value: 'bookmark', label: <span className='yv-green-link'>{intl.formatMessage({ id: 'Reader.verse action.bookmark' })}</span> },
			{ value: 'note', label: <span className='yv-green-link'>{intl.formatMessage({ id: 'Reader.verse action.note' })}</span> }
		]

		let colorList
		if (Array.isArray(highlightColors)) {
			colorList = (
				<ColorList
					list={highlightColors}
					onClick={this.handleHighlight}
					deletableColors={deletableColors}
					deleteColor={this.deleteColor}
					isRtl={isRtl}
				/>
			)
		}

		return (
			<div className='verse-action'>
				<div className='verse-action-footer' ref={(c) => { this.container = c }}>
					<a tabIndex={0} onClick={this.handleClose} className='close-button yv-gray-link'><FormattedMessage id='plans.stats.close' /></a>
					<span className='verse-selection' style={{ opacity: (human && human.length) ? 1 : 0 }}>{ human }</span>
					<ButtonBar items={actions} onClick={this.handleActionClick} />
					{ colorList }
				</div>
				<FullscreenDrawer
					isOpen={momentContainerOpen}
					onClose={this.handleMomentContainerClose}
					className='va-moment-container'
				>
					<MomentCreate
						{...this.props}
						// changing the key will cause a rerender for all children
						// resetting all local state
						key={momentContainerOpen}
						isLoggedIn={auth && auth.isLoggedIn}
						kind={momentKind}
						human={human}
						verseContent={verseContent}
						references={selectedReferences}
						version_id={version ? version.id : null}
						local_abbreviation={version ? version.local_abbreviation : null}
						labels={momentsLabels}
						onClose={this.handleMomentContainerClose}
						colors={highlightColors}
						isRtl={isRtl}
					/>
				</FullscreenDrawer>
			</div>
		)
	}
}

VerseAction.propTypes = {
	selection: PropTypes.object.isRequired,
	highlightColors: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired,
}

export default injectIntl(VerseAction)
