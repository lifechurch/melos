import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../actions/creators'
import NavArrows from '../../../Bible/components/content/NavArrows'


class PlanNavigation extends Component {

	constructor(props) {
		super(props)
	}


	render() {
		const {
			plan,
			day,
			next,
			previous,
			isFinalContent,
			localizedLink
		} = this.props
		console.log(this.props)

		const dayObj = plan.calendar[day]
		const totalContentsNum = dayObj.additional_content.completed !== null ? (dayObj.references.length + 1) : dayObj.references.length
		let customNext = null
		if (isFinalContent) {
			customNext = (
				<div>chekmark</div>
			)
		}
		return (
			<div className='plan-nav'>
				<div>
					<img src={plan.images[2].url} />
					<div className='plan-info'>
						{ plan.name[plan.language_tag] || plan.name.default }
						<FormattedMessage id="plans.day number" values={{ day }} />
						&bull;
						<FormattedMessage id="plans.which reading" values={{ current: day, total: totalContentsNum }} />
					</div>
				</div>
				<NavArrows localizedLink={localizedLink} nextURL={next} previousURL={previous} customNext={customNext} />
			</div>
		)
	}
}

PlanNavigation.propTypes = {

}

PlanNavigation.defaultProps = {

}

export default PlanNavigation