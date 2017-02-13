import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

class ShareWidget extends Component {

	constructor(props) {
		super(props)
		this.state = { dialogOpen: false }
	}

	handleClick = () => {
		this.setState({ dialogOpen: !this.state.dialogOpen })
	}


	render() {
		const { collapsible, button } = this.props

		let shareText = null
		let classes = 'share-panel'

		if (collapsible) {
			shareText = <a onClick={this.handleClick}><FormattedMessage id='features.EventEdit.components.EventEditNav.share' /></a>
			if (!this.state.dialogOpen) {
				// hide the widget
				classes = 'share-panel ng-hide'
			}
		}
		if (button) {
			shareText = (
				<a onClick={this.handleClick}>
					{ button }
				</a>
			)
		}

		if (typeof window !== 'undefined') {
			var interval = setInterval(() => {
				if (typeof window !== 'undefined' && window.addthis
					&& window.addthis.layers && window.addthis.layers.refresh) {
					clearInterval(interval);
					window.addthis.layers.refresh()
				}
			}, 100);
		}

		return (
			<div>
				{ shareText }
				<div className={classes}>
					<div className='video addthis_sharing_toolbox' />
				</div>
			</div>
		)
	}
}

ShareWidget.propTypes = {
	collapsible: PropTypes.boolean,
	button: PropTypes.node,
}
ShareWidget.defaultProps = {
	collapsible: true,
	button: null,
}
export default ShareWidget
