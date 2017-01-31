import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../actions/creators'
import { FormattedMessage } from 'react-intl'
import PlanArrows from './PlanArrows'


class PlanNavigation extends Component {

	constructor(props) {
		super(props)
	}


	render() {
		const { plan, next, previous, isFinalContent } = this.props
		console.log(this.props)
		return (
			<div className='plan-nav'>
				<div>
					<img src={plan.images[0].url} />
					<div className='plan-info'>
					</div>
				</div>
				<PlanArrows next={next} previous={previous} showCheckMark={isFinalContent} />
			</div>
		)
	}
}

PlanNavigation.propTypes = {

}

PlanNavigation.defaultProps = {

}

export default PlanNavigation