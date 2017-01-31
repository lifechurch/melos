import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../actions/creators'
import { FormattedMessage } from 'react-intl'
import PlanNavigation from './PlanNavigation'
import PlanArrows from './PlanArrows'

class PlanReader extends Component {

	constructor(props) {
		super(props)
	}


	render() {
		const { plan, location: { query: { day, content, id } } } = this.props

		// we'll have the references in state for the day, keyed by usfm string,
		// so we can grab the actual reference html from there with the following key
		// references = props.references[plan.calendar[day].references[content] .... ]
		return (
			<div>
				<PlanNavigation />
				{
					// render the devo or ref component (child of PlanReaderView based on route)
					// with the params from the url
					React.cloneElement(this.props.children, {
						plan,
						day: parseInt(day, 10),
						content,
						id,
					})
				}
				<PlanArrows next={null} previous={null} />
			</div>
		)
	}
}

PlanReader.propTypes = {

}

PlanReader.defaultProps = {

}

export default PlanReader