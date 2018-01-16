import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import AddThis from '../../../components/AddThis'
import ClickTarget from '../../../components/ClickTarget'


class ShareWidget extends Component {
	constructor(props) {
		super(props)
		this.state = { dialogOpen: false }
	}

	handleClick = () => {
		this.setState({ dialogOpen: !this.state.dialogOpen })
	}

	render() {
		const { collapsible, button, title, text, url } = this.props
		const { dialogOpen } = this.state
		let shareText = null
		let classes = 'share-panel'

		if (collapsible) {
			shareText = (
				<a tabIndex={0} onClick={this.handleClick}>
					<FormattedMessage id='features.EventEdit.components.EventEditNav.share' />
				</a>
			)
			if (!dialogOpen) {
				// hide the widget
				classes = 'share-panel ng-hide'
			}
		}
		if (button) {
			shareText = (
				<a tabIndex={0} onClick={this.handleClick}>
					{ button }
				</a>
			)
		}

		return (
			<div>
				{ shareText }
				<div className={classes}>
					<ClickTarget
						handleOutsideClick={() => {
							if (dialogOpen) {
								this.setState({ dialogOpen: false })
							}
						}}
					>
						<AddThis title={title} text={text} url={url} />
					</ClickTarget>
				</div>
			</div>
		)
	}
}

ShareWidget.propTypes = {
	collapsible: PropTypes.bool,
	button: PropTypes.node,
	url: PropTypes.string,
}
ShareWidget.defaultProps = {
	collapsible: true,
	button: null,
	url: null,
}
export default ShareWidget
