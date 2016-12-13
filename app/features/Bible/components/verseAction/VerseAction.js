import React, { Component, PropTypes } from 'react'
import ColorList from './ColorList'
import { injectIntl } from 'react-intl'
import ButtonBar from '../../../../components/ButtonBar'
import TriggerButton from '../../../../components/TriggerButton'
import ShareWidget from './share/Share'
import CopyToClipboard from 'react-copy-to-clipboard'
import ActionCreators from '../../actions/creators'
import moment from 'moment'

class VerseAction extends Component {
	constructor(props) {
		super(props)
		this.state = { verseCopied: false, isOpen: false }
		this.handleActionClick = ::this.handleActionClick
		this.handleClose = ::this.handleClose
		this.handleHighlight = ::this.handleHighlight
		this.openMe = ::this.openMe
		this.closeMe = ::this.closeMe
	}

	handleActionClick(e) {
		const { colors } = this.props
		if (e.value === 'note') {
			this.handleHighlight(colors[Math.floor(Math.random() * (colors.length))])
		}
	}

	closeMe() {
		this.container.classList.remove('open')
	}

	openMe() {
		this.container.classList.add('open')
	}

	handleClose(e) {
		const { onClose } = this.props
		if (typeof onClose === 'function') {
			onClose()
		}
	}

	handleHighlight(color) {
		const { selection: { verses, version }, dispatch } = this.props
		const references = [{ usfm: verses, version_id: version }]

		dispatch(ActionCreators.momentsCreate(true, {
			kind: 'highlight',
			references: references,
			color: color,
			created_dt: moment().format()
		}))

		this.handleClose({})
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

	render() {
		const { selection: { chapter, human, text, url }, colors, intl } = this.props
		const copyAction = (
			<CopyToClipboard
				text={`"${text}"\n\n${chapter}:${human}\n${url}`}
				onCopy={() => {
					this.setState({ copied: true })
					setTimeout(() => {
						this.setState({ copied:false })
					}, 10000)
				}}>
				<span className="yv-green-link">{this.state.copied ?
					intl.formatMessage({ id: 'verseAction.Actions.Copied' }) :
					intl.formatMessage({ id: 'verseAction.Actions.Copy' }) }
				</span>
			</CopyToClipboard>
		)

		const actions = [
			{ value: 'share', label: <ShareWidget label={`${chapter}:${human}`} url={url} text={text} /> },
			{ value: 'copy', label: copyAction },
			{ value: 'bookmark', label: <span className="yv-green-link">{intl.formatMessage( { id: 'verseAction.Actions.Bookmark' })}</span> },
			{ value: 'note', label: <span className="yv-green-link">{intl.formatMessage( { id: 'verseAction.Actions.Note' })}</span> }
		]

		let colorList
		if (Array.isArray(colors)) {
			colorList = <ColorList list={colors} />
		}

		return (
			<div className={`verse-action-footer`} ref={(c) => { this.container = c }}>
				<a onClick={this.handleClose} className="close-button yv-gray-link">Close</a>
				<span className="verse-selection" style={{opacity: (chapter && chapter.length && human && human.length) ? 1 : 0 }}>{chapter}:{human}</span>
				<ButtonBar items={actions} onClick={this.handleActionClick} />
				{colorList}
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