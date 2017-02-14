import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Immutable from 'immutable'

class ShareWidget extends Component {

	constructor(props) {
		super(props)
		this.state = { dialogOpen: false }
	}

	handleClick = () => {
		this.setState({ dialogOpen: !this.state.dialogOpen })
	}


	render() {
		const { collapsible, button, url } = this.props

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
			const interval = setInterval(() => {
				if (typeof window !== 'undefined' && window.addthis
					&& window.addthis.layers && window.addthis.layers.refresh) {
					clearInterval(interval);
					window.addthis.layers.refresh()
				}
			}, 100);

			// if (url) {
			// 	// window.addthis.update('share', 'url', url)
			// 	window.addthis_share = Immutable.fromJS(window.addthis_share)
			// 		.set('url', url)
			// 		.toJS()
			// } else {
			// 	window.addthis_share.layers.refresh()
			// }
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
