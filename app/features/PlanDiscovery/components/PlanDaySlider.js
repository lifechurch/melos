import React, { PropTypes } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import Slider from 'react-slick'
import { FormattedMessage } from 'react-intl'

import RevManifest from '../../../../app/lib/revManifest'

function PlanDaySlider(props) {
	const {
		calendar,
		subscriptionLink,
		aboutLink,
		day,
		mode
	} = props

	const settings = {
		className: 'plan-day-slider',
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

		const active = (d.day === day)
			? 'active'
			: ''

		const completed = d.completed
			? 'check-background'
			: ''

		const to = (mode === 'subscription')
			? { pathname: subscriptionLink, query: { day: d.day } }
			: `${aboutLink}/day/${d.day}`

		return (
			<Link key={d.day} to={to}>
				<div className={`day ${active}`} style={{ backgroundColor: 'white' }}>
					<div className={`day-top ${completed}`} />
					<div className="day-bottom">
						<h1>{d.day}</h1>
						<h4>
							{(mode === 'subscription')
								? date
								: <FormattedMessage id="plans.day number" values={{ day: d.day }} />
							}
						</h4>
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
	subscriptionLink: PropTypes.string.isRequired,
	aboutLink: PropTypes.string.isRequired,
	day: PropTypes.number.isRequired,
	mode: PropTypes.string.isRequired
}

export default PlanDaySlider
