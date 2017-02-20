import React, { PropTypes } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import Slider from 'react-slick'

function PlanDaySlider(props) {
	const { calendar, link, day } = props
	const settings = {
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
			}, {
				breakpoint: 376,
				settings: {
					arrows: false,
					slidesToShow: 4,
					slidesToScroll: 4
				}
			}, {
				breakpoint: 321,
				settings: {
					arrows: false,
					slidesToShow: 3,
					slidesToScroll: 3
				}
			}
		]
	}

	const slides = calendar.map((d) => {
		const date = moment(d.date).format('l')
		const active = (d.day === day) ? 'active' : ''
		const completed = d.completed ? 'check-background' : ''
		return (
			<Link key={d.day} to={{ pathname: link, query: { day: d.day } }}>
				<div className={`day ${active}`} style={{ backgroundColor: 'white' }}>
					<div className={`day-top ${completed}`} />
					<div className="day-bottom">
						<h1>{d.day}</h1>
						<h4>{date}</h4>
					</div>
				</div>
			</Link>
		)
	})

	return (
		<div>
			<Slider {...settings}>{slides}</Slider>
		</div>
	)
}

PlanDaySlider.propTypes = {
	calendar: PropTypes.array.isRequired,
	link: PropTypes.string.isRequired,
	day: PropTypes.number.isRequired
}

export default PlanDaySlider
