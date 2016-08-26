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

		if (collapsible) {
			if (this.state.dialogOpen) {
				var share = <a className='video addthis_sharing_toolbox' onClick={::this.handleClick}><FormattedMessage id='share'/></a>
			} else {
				var share = <a className='video addthis_sharing_toolbox' style={"display: none;"} onClick={::this.handleClick}><FormattedMessage id='share'/></a>
			}
		} else {
			var share = <a className='video addthis_sharing_toolbox'><FormattedMessage id='share'/></a>
		}

		return (
			<p className='share-panel'>{ share }</p>
		)
	}
}

export default ShareWidget