import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import Image from '../../../components/Carousel/Image'
import { Link } from 'react-router'
import PlanActionButtons from '../components/PlanActionButtons'
import { FormattedMessage } from 'react-intl'

class AboutPlan extends Component {


	render() {
		const { readingPlan } = this.props

		var publisherUrl = (readingPlan.publisher_url) ? <a className='publisher'>{readingPlan.publisher_url}</a> : null

		return (
			<div className='row about-plan horizontal-center'>
				<div className='columns large-8 medium-8'>
					<div className='about-plan-header'>
						<Link className='plans' to={`/en/reading-plans`}>&larr; Plans</Link>
					</div>
					<div className='plan-image'>
						<Image width={720} height={400} thumbnail={false} imageId="false" type="about_plan" config={readingPlan} />
					</div>
					<div className='row'>
						<div className='columns large-8 medium-8'>
							<h1>{readingPlan.name.default}</h1>
							<p className='plan_length'>{readingPlan.total_days}</p>
							<p className='plan_about'>{readingPlan.about.text.default}</p>
							<h3 className='publisher'><FormattedMessage id='plans.publisher'/></h3>
							<p className='publisher'>{readingPlan.copyright.text.default}</p>
							{publisherUrl}
						</div>
						<div className='columns large-4 medium-4'>
							<div className='side-col'>
								<PlanActionButtons readingPlan={readingPlan} />
							</div>
							<hr></hr>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default AboutPlan