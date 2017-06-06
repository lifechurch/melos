import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import Slider from 'react-slick'
import { FormattedMessage } from 'react-intl'


class PlanDaySlider extends Component {

	componentDidMount() {
		const { day } = this.props
		if (typeof day !== 'undefined') {
			setTimeout(() => {
				this.scrollSlider(day - 1)
			}, 150)
		}
	}

	scrollSlider = (slideNum) => {
		const slide = parseInt(slideNum, 10)
		if (this.refs.slider && !Number.isNaN(slide)) {
			this.refs.slider.slickGoTo(slide)
		}
	}

	render() {
		const {
		calendar,
		dayBaseLink,
		day,
		showDate,
		isRtl,
		language_tag,
	} = this.props

		const settings = {
			className: 'plan-day-slider',
			centerMode: false,
			infinite: false,
			variableWidth: true,
			slidesToScroll: 6,
			slidesToShow: 1,
			autoPlay: false,
			rtl: isRtl,
			dir: isRtl ? 'rtl' : 'ltr',
			responsive: [
				{
					breakpoint: 600,
					settings: {
						arrows: false,
						slidesToScroll: 4
					}
				}, {
					breakpoint: 376,
					settings: {
						arrows: false,
						slidesToScroll: 4
					}
				}, {
					breakpoint: 321,
					settings: {
						arrows: false,
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
			slider = (
				<Slider {...settings} ref='slider'>
					{ slides }
				</Slider>
			)
		}

		return (
			<div>
				{ slider }
			</div>
		)
	}
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
