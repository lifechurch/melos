import React, { PropTypes } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import Slider from 'react-slick'
import { FormattedMessage } from 'react-intl'


function PlanDaySlider(props) {
	const {
		calendar,
		dayBaseLink,
		day,
		showDate,
		isRtl,
		language_tag,
	} = props

	const settings = {
		className: 'plan-day-slider',
		centerMode: false,
		infinite: false,
		variableWidth: true,
		initialSlide: day - 1,
		slidesToScroll: 8,
		slidesToShow: 8,
		autoPlay: false,
		rtl: isRtl,
		dir: isRtl ? 'rtl' : 'ltr',
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

	moment.locale(language_tag)
	const slides = calendar.map((d) => {
		const date = moment(d.date).format('l')

		const active = (d.day === day)
			? 'active'
			: ''

		const completed = d.completed
			? 'check-background'
			: ''

		const to = `${dayBaseLink}/day/${d.day}`

		return (
			<Link key={d.day} to={to}>
				<div className={`day ${active}`} style={{ backgroundColor: 'white' }}>
					<div className={`day-top ${completed}`} />
					<div className="day-bottom">
						<h1>{d.day}</h1>
						<h4>
							{(showDate)
								? date
								: <FormattedMessage id="plans.day number" values={{ day: d.day }} />
							}
						</h4>
					</div>
				</div>
			</Link>
		)
	})

	let slider
	if (isRtl) {
		const outerStyle = {
			width: '100%',
			overflowX: 'scroll'
		}
		const innerStyle = {
			width: `${(80 * calendar.length) + 30}px`
		}

		slider = (
			<div className='rtl-faux-slider' style={outerStyle}>
				<div className='plan-day-slider' style={innerStyle}>
					{ slides }
				</div>
			</div>
		)
	} else {
		slider = <Slider {...settings}>{ slides }</Slider>
	}

	return (
		<div>
			{ slider }
		</div>
	)
}

PlanDaySlider.propTypes = {
	calendar: PropTypes.array.isRequired,
	dayBaseLink: PropTypes.string.isRequired,
	day: PropTypes.number.isRequired,
	showDate: PropTypes.bool,
	language_tag: PropTypes.string,
	isRtl: PropTypes.bool,
}

PlanDaySlider.defaultProps = {
	showDate: true,
	language_tag: 'en',
	isRtl: false,
}

export default PlanDaySlider
