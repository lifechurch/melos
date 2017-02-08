import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import ActionCreators from '../../actions/creators'
import CheckMark from '../../../../components/CheckMark'
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
			previous,
			dayBasePath,
			whichContent,
			totalContentsNum,
			isFinalContent,
			onHandleComplete,
			localizedLink
		} = this.props

		if (Object.keys(plan).length < 1) {
			return (
				<div />
			)
		}

		let customNext = null
		if (isFinalContent) {
			customNext = (
				<div className='next-arrow checkmark vertical-center horizontal-center'>
					<CheckMark fill='white' width={27} height={26} classes='reader-arrow' />
				</div>
			)
		}

		return (
			<div className=''>
				<Header sticky={true} classes={'plan-nav-header'}>
					<div className='nav-content columns large-6 medium-8 medium-centered'>
						<Link to={dayBasePath}>
							<img alt='reading plan' className='nav-img img-left' src={plan.images[2].url} />
						</Link>
						<div className='plan-info'>
							<Link to={dayBasePath}>
								<div className='nav-title'>{ plan.name[plan.language_tag] || plan.name.default }</div>
							</Link>
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
				<NavArrows
					localizedLink={localizedLink}
					nextURL={next}
					previousURL={previous}
					customNext={customNext}
					onNextClick={onHandleComplete}
				/>
			</div>
		)
	}
}

PlanNavigation.propTypes = {

}

PlanNavigation.defaultProps = {

}

export default PlanNavigation
