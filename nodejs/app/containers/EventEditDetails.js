import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import DetailsEdit from '../features/EventEdit/features/details/components/DetailsEdit'
import ActionCreators from '../features/EventEdit/features/details/actions/creators'
import { injectIntl } from 'react-intl'

class EventEditDetails extends Component {
	handleChange(changeEvent) {
		const { name, value } = changeEvent.target
		const { dispatch } = this.props
		dispatch(ActionCreators.setDetails(name, value))
	}

	handleNext(clickEvent) {
		const { event, dispatch, params } = this.props
		dispatch(ActionCreators.saveDetails(event.item, true, params.locale))
	}

	handleLeave() {
		const { dispatch, event } = this.props
		if (event.detailsValid) {
			if (event.item.id) {
				dispatch(ActionCreators.update(event.item))
			} else {
				dispatch(ActionCreators.create(event.item))
			}
		}
	}

	render() {
		const { event, dispatch, handleDetailsNext, params, intl } = this.props
		return (
			<div>
				<Helmet title={intl.formatMessage({ id: 'containers.EventEditDetails.title' })} />
				<DetailsEdit intl={intl} event={event} params={params} dispatch={dispatch} handleChange={::this.handleChange} handleLeave={::this.handleLeave} handleNext={::this.handleNext} />
			</div>
		)
	}
}

export default injectIntl(EventEditDetails)
