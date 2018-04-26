import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ActionCreators } from '../../../../../actions/modals'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import localeFeatures from '../../../../../../locales/config/localeFeatures.json'

const CHOP_ENABLED = typeof window !== 'undefined' ? localeFeatures.churchOnline.indexOf(window.__LOCALE__.locale) !== -1 : true

class LocationAddButtons extends Component {

	handleAddPhysicalLocationClick(clickEvent) {
		const { event, dispatch, handleAddPhysicalLocationClick } = this.props
		if (typeof event.rules.locations.canAddPhysical === 'object') {
			const { modal } = event.rules.locations.canAddPhysical
			if (typeof modal === 'string') {
				dispatch(ActionCreators.openModal(modal))
			}
		} else {
			handleAddPhysicalLocationClick(clickEvent)
		}
	}

	handleAddVirtualLocationClick(clickEvent) {
		const { event, dispatch, handleAddVirtualLocationClick } = this.props

		if (typeof event.rules.locations.canAddVirtual === 'object') {
			const { modal } = event.rules.locations.canAddVirtual
			if (typeof modal === 'string') {
				dispatch(ActionCreators.openModal(modal))
			}
		} else {
			handleAddVirtualLocationClick(clickEvent)
		}
	}

	render() {
		const { event } = this.props
		return (
			<div className='location-add-buttons'>
				<a disabled={!event.rules.locations.canAddPhysical} className='hollow-button green' onClick={::this.handleAddPhysicalLocationClick}><FormattedMessage id="features.EventEdit.features.location.components.LocationAddButtons.addPhysical" /></a>
				<p className='button-caption'><FormattedMessage id="features.EventEdit.features.location.components.LocationAddButtons.promptPhysical" /></p>
				<a disabled={!event.rules.locations.canAddVirtual} className='hollow-button green' onClick={::this.handleAddVirtualLocationClick}><FormattedMessage id="features.EventEdit.features.location.components.LocationAddButtons.addVirtual" /></a>
				{ CHOP_ENABLED ? <p className='button-caption'><FormattedHTMLMessage id="features.EventEdit.features.location.components.LocationAddButtons.churchOnline" values={{ url: 'http://churchonlineplatform.com' }} /></p> : null }
			</div>
		)
	}
}

LocationAddButtons.propTypes = {
	event: PropTypes.object.isRequired,
	handleAddPhysicalLocationClick: PropTypes.func.isRequired,
	handleAddVirtualLocationClick: PropTypes.func.isRequired
}

export default LocationAddButtons
