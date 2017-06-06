import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Immutable from 'immutable'

class Share extends Component {

	constructor(props) {
		super(props)
		this.state = { isOpen: false }
		this.handleClick = ::this.handleClick
		this.handleOutsideClick = ::this.handleOutsideClick
		this.handleMouseDown = ::this.handleMouseDown
		this.handleMouseUp = ::this.handleMouseUp
		this.insideClick = false
	}

	handleOutsideClick() {
		if (this.insideClick) {
			return
		}
		this.setState({ isOpen: false })
	}

	handleMouseDown() {
		this.insideClick = true
	}

	handleMouseUp() {
		this.insideClick = false
	}

	handleClick() {
		this.setState({ isOpen: !this.state.isOpen })
	}

	componentDidMount() {
		if (typeof window !== 'undefined') {

			// Listen for Mouse Down Outside Events
			window.addEventListener('mousedown', this.handleOutsideClick, false);

			// Initialize AddThis, if Necessary
			var interval = setInterval(() => {
				if (typeof window !== 'undefined'
						&& window.addthis
						&& window.addthis.layers
						&& window.addthis.layers.refresh
				) {
					clearInterval(interval);
					window.addthis.layers.refresh()
				}
			}, 100);

		}
	}

	componentWillUnmount() {
		if (typeof window !== 'undefined') {
			window.removeEventListener('mousedown', this.handleOutsideClick);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		const { label: nextLabel, text: nextText, url: nextUrl } = nextProps
		const { label, text, url } = this.props

		const { isOpen: nextIsOpen } = nextState
		const { isOpen } = this.state

		if (
			typeof window !== 'undefined' &&
			(
				label !== nextLabel ||
				text !== nextText ||
				url !== nextUrl ||
				isOpen !== nextIsOpen
			)
		) {
			if (typeof window.addthis_share !== 'object') {
				window.addthis_share = {}
			}

			// window.addthis_share = Immutable.fromJS(window.addthis_share)
			// 	.set('url', nextUrl)
			// 	.set('title', `${nextText} ${nextLabel}`)
			// 	.set('description', nextText)
			// 	.toJS()

			window.addthis.update('share', 'url', nextUrl)
			window.addthis.update('share', 'title', `${nextText} ${nextLabel}`)
			window.addthis.update('share', 'description', nextText)

			return true
		}

		return false
	}

	render() {
		const { button, label, classOverride } = this.props
		const { isOpen } = this.state
		const classes = isOpen ? 'va-share-open' : 'va-share-closed'
		const buttonLabel = isOpen ? <FormattedMessage id='plans.stats.close' /> : <FormattedMessage id='features.EventEdit.components.EventEditNav.share' />

		let buttonDiv
		if (button) {
			buttonDiv = (
				<div onClick={this.handleClick}>
					{ button }
				</div>
			)
		} else {
			buttonDiv = (
				<a className="yv-green-link" onClick={this.handleClick}>
					{ buttonLabel }
				</a>
			)
		}

		return (
			<div className={classOverride || 'va-share'} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
				{ buttonDiv }
				<div className='va-share-panel-wrapper'>
					<div className={`va-share-panel ${classes}`}>
						<div className='va-share-header'>{label}</div>
						<div className='addthis_inline_share_toolbox_a0vl' />
					</div>
				</div>
			</div>
		)
	}
}

Share.propTypes = {
	label: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	classOverride: PropTypes.string,
	button: PropTypes.node,
}

Share.defaultProps = {
	label: '',
	text: '',
	url: '',
	classOverride: '',
	button: null,
}

export default Share
