import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import Image from '../../../components/Carousel/Image'
import { Link } from 'react-router'
import PlanActionButtons from './PlanActionButtons'
import { FormattedMessage } from 'react-intl'
import AvatarList from '../../../components/AvatarList'
import ShareWidget from './ShareWidget'

class AboutPlan extends Component {

	constructor(props) {
		super(props)
		this.state = { dialogOpen: false }
	}

	handleClick() {
		this.setState({ dialogOpen: !this.state.dialogOpen })
	}


	render() {
		const { readingPlan, imageConfig, auth } = this.props

		if (!(readingPlan && readingPlan.stats && readingPlan.related)) {
			return (
				<div></div>
			)
		}

		var friendsReading, friendsCompleted, completions, readingList, completedList = null
		var readingPlansStats = ((completions = readingPlan.stats.total_completed) >= 1000) ? <p className='friends_completed'><FormattedMessage id='plans.stats.total completions' values={{count: completions}} /></p> : null
		var publisherUrl = (readingPlan.publisher_url) ? <a className='publisher'>{readingPlan.publisher_url}</a> : null

		if (readingList = readingPlan.stats.friends.subscribed) {
			friendsReading = (
				<div>
					<p className='friends_completed'><FormattedMessage id='plans.stats.friends reading'/></p>
					<AvatarList avatarList={readingList} />
				</div>
			)
		}
		if (completedList = readingPlan.stats.friends.completed) {
			friendsCompleted = (
				<div>
					<p className='friends_completed'><FormattedMessage id='plans.stats.friends completed'/></p>
					<AvatarList avatarList={completedList} />
				</div>
			)
		}


		return (
			<div className='row about-plan horizontal-center'>
				<div className='columns large-8 medium-8'>
					<div className='about-plan-header'>
						<Link className='plans' to={`/en/reading-plans`}>&larr; Plans</Link>
						<ShareWidget/>
					</div>
					<div className='plan-image'>
						<Image width={720} height={400} thumbnail={false} imageId="false" type="about_plan" config={readingPlan} />
					</div>
					<div className='row'>
						<div className='columns large-8 medium-8'>
							<h1>{ readingPlan.name.default }</h1>
							<p className='plan_length'><FormattedMessage id='plans.total_days' values={{ count: readingPlan.total_days }}/></p>
							<p className='plan_about'>{ readingPlan.about.text.default }</p>
							<h3 className='publisher'><FormattedMessage id='plans.publisher'/></h3>
							<p className='publisher'>{ readingPlan.copyright.text.default }</p>
							<Link className='plans' to={publisherUrl}><FormattedMessage id='plans.about publisher'/></Link>
						</div>
						<div className='columns large-4 medium-4'>
							<div className='side-col'>
								<PlanActionButtons {...this.props} />
							</div>
							<hr></hr>
							<div className='stats'>
								{ friendsReading }
								{ friendsCompleted }
								{ readingPlansStats }
							</div>
						</div>
					</div>
					<hr></hr>
					<div className='row'>
						<Carousel carouselContent={readingPlan.related} carouselType="standard" imageConfig={imageConfig}/>
					</div>
				</div>
			</div>
		)
	}
}

export default AboutPlan