import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import Image from '../../../components/Carousel/Image'
import { Link } from 'react-router'
import PlanActionButtons from '../components/PlanActionButtons'
import { FormattedMessage } from 'react-intl'
import AvatarList from '../../../components/AvatarList'

class ShareWidget extends Component {

	constructor(props) {
		super(props)
		this.state = { dialogOpen: false }
	}

	handleClick() {
		this.setState({ dialogOpen: !this.state.dialogOpen })
	}


	render() {
		const collapsible = this.props.collapsible || true

		var shareText = null
		var classes = 'share-panel'

		if (collapsible) {
			shareText = <a onClick={::this.handleClick}><FormattedMessage id='features.EventEdit.components.EventEditNav.share'/></a>
			if (!this.state.dialogOpen) {
				// hide the widget
				classes = 'share-panel ng-hide'
			}
		}

		return (
			<div>
				{ shareText }
				<div className={classes}>
					<div className='video addthis_sharing_toolbox'></div>
				</div>
			</div>
		)
	}
}

export default ShareWidget