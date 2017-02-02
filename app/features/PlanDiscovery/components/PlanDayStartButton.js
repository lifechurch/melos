import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

class PlanDayStartButton extends Component {
	render() {
		const { dayData: { additional_content: { html: devoHtml, text: devoText }, day }, link } = this.props

		let startUrl
		if ((typeof devoHtml !== 'undefined' && devoHtml !== null)
			|| (typeof devoText !== 'undefined' && devoText !== null)) {
			startUrl = { pathname: `${link}/devo`, query: { day } }
		} else {
			startUrl = { pathname: `${link}/ref`, query: { day, content: 0 } }
		}

		return (
			<Link className="solid-button green" to={startUrl}>
				<FormattedMessage id="plans.widget.start reading" />
			</Link>
		)
	}
}

PlanDayStartButton.propTypes = {
	dayData: PropTypes.object.isRequired,
	link: PropTypes.string.isRequired
}

export default PlanDayStartButton