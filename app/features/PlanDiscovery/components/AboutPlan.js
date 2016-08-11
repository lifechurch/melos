import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import Image from '../../../components/Carousel/Image'
import { Link } from 'react-router'

class AboutPlan extends Component {


	render() {
		const { readingPlan } = this.props

		var planImage = null
		readingPlan.images.forEach((image) => {
			if (image.width == 1280) {
				planImage = image
			}
		})

		return (
			<div className='row collections-view'>
				<div className='columns medium-12'>
					<Link className='plans' to={`/en/reading-plans`}>&larr; Plans</Link>
					<img src={planImage.url} width={planImage.width} height={planImage.height} />
				</div>
			</div>
		)
	}
}

export default AboutPlan