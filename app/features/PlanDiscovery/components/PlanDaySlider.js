import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import Slider from 'react-slick'

class PlanDaySlider extends Component {
	render() {
		const { plan, link, day } = this.props

		this.settings = {
			className: 'day-slider',
			centerMode: false,
			infinite: false,
			variableWidth: true,
			initialSlide: day - 1,
			slickGoTo: day - 1,
			slidesToScroll: 8,
			slidesToShow: 8,
			autoPlay: false,
			rtl: false,
			dir: 'ltr',
			responsive: [
				{
					breakpoint: 436,
					settings: {
						arrows: false,
						slidesToShow: 5,
						slidesToScroll: 5
					}
				},{
					breakpoint: 376,
					settings: {
						arrows: false,
						slidesToShow: 4,
						slidesToScroll: 4
					}
				},{
					breakpoint: 321,
					settings: {
						arrows: false,
						slidesToShow: 3,
						slidesToScroll: 3
					}
				}
			]
		}

		const slides = plan.calendar.map((d, i) => {
			const date = moment(d.date).format('l')
			const active = (d.day == day) ? 'active' : ''
			return (
				<Link key={d.day} to={{ pathname: link, query: { day: d.day } }}>
					<div className={`day ${active}`}>
						<div className="day-top" />
						<div className="day-bottom">
							<h1>{d.day}</h1>
							<h4>{date}</h4>
						</div>
					</div>
				</Link>
			)
		})

		return (
			<div style={{ overflowY: 'hidden' }} >
				<Slider {...this.settings}>{slides}</Slider>
			</div>
		)
	}
}

PlanDaySlider.propTypes = {
	plan: PropTypes.object.isRequired
}

PlanDaySlider.defaultProps = {
	plan: { calendar: [] }
}

export default PlanDaySlider