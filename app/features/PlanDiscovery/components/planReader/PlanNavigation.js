import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../actions/creators'
import NavArrows from '../../../Bible/components/content/NavArrows'
import Header from '../../../Bible/components/header/Header'


class PlanNavigation extends Component {

	constructor(props) {
		super(props)
	}


	render() {
		const {
			plan,
			day,
			next,
			whichContent,
			totalContentsNum,
			previous,
			isFinalContent,
			localizedLink
		} = this.props
		console.log(this.props)

		if (!plan) {
			return (
				<div />
			)
		}

		let customNext = null
		if (isFinalContent) {
			customNext = (
				<div>chekmark</div>
			)
		}

		return (
			<div className=''>
				<Header sticky={true} classes={'plan-nav-header'}>
					<div className='nav-content columns large-8 medium-8 medium-centered'>
						<img className='nav-img img-left' src={plan.images[2].url} />
						<div className='plan-info'>
							<div className='nav-title'>{ plan.name[plan.language_tag] || plan.name.default }</div>
							<div className='nav-length'>
								<FormattedMessage id="plans.day number" values={{ day }} />
								&nbsp;
								&bull;
								&nbsp;
								<FormattedMessage id="plans.which reading" values={{ current: whichContent, total: totalContentsNum }} />
							</div>
						</div>
					</div>
				</Header>
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