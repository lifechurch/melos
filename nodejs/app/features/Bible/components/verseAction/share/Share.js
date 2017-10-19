import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ClickTarget from '../../../../../components/ClickTarget'
import AddThis from '../../../../../components/AddThis'

class Share extends Component {
	constructor(props) {
		super(props)
		this.state = { isOpen: false }
	}

	onClose = () => {
		const { isOpen } = this.state
		if (isOpen) {
			this.setState({ isOpen: false })
		}
	}

	handleClick = () => {
		this.setState({ isOpen: !this.state.isOpen })
	}

	render() {
		const { button, label, classOverride, text, url } = this.props
		const { isOpen } = this.state
		const classes = isOpen ? 'va-share-open' : 'va-share-closed'
		const buttonLabel = isOpen
			? <FormattedMessage id='plans.stats.close' />
			: <FormattedMessage id='features.EventEdit.components.EventEditNav.share' />

		let buttonDiv
		if (button) {
			buttonDiv = (
				<div onClick={this.handleClick} className='vertical-center'>
					{ button }
				</div>
			)
		} else {
			buttonDiv = (
				<a className="yv-green-link" tabIndex={0} onClick={this.handleClick}>
					{ buttonLabel }
				</a>
			)
		}

		return (
			<ClickTarget handleOutsideClick={this.onClose}>
				<div className={classOverride || 'va-share'}>
					{ buttonDiv }
					<div className='va-share-panel-wrapper'>
						<div className={`va-share-panel ${classes}`}>
							<div className='va-share-header'>{label}</div>
							<AddThis text={text} url={url} title={`${text} ${label}`} />
						</div>
					</div>
				</div>
			</ClickTarget>
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
