import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router'
import Slider from 'react-slick'
import { FormattedMessage } from 'react-intl'
import CheckMark from '../../../components/CheckMark'


class PlanDaySlider extends Component {
	componentDidMount() {
		const { day } = this.props
		if (typeof day !== 'undefined') {
			setTimeout(() => {
				this.scrollSlider(day - 1)
			}, 150)
		}
	}

	shouldComponentUpdate(nextProps) {
		const { day, progressDays } = this.props
		if (day !== nextProps.day || progressDays !== nextProps.progressDays) {
			return true
		}
		return false
	}

	scrollSlider = (slideNum) => {
		const slide = parseInt(slideNum, 10)
		if (this.refs.slider && !Number.isNaN(slide)) {
			this.refs.slider.slickGoTo(slide)
		}
	}

	render() {
		const {
			totalDays,
			progressDays,
			start_dt,
			dayBaseLink,
			day,
			isCompleted,
			showDate,
			isRtl,
			language_tag,
		} = this.props

		const settings = {
			className: 'plan-day-slider',
			centerMode: false,
			infinite: false,
			variableWidth: true,
			slidesToScroll: 4,
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
		const slides = []
		if (totalDays) {
			const today = moment().format('MMM D')
			for (let i = 0; i < totalDays; i++) {
				let checkmark = null
				const isActiveDay = ((i + 1) === parseInt(day, 10))
				const active = isActiveDay ? 'active' : ''
				const progressDay = progressDays ? progressDays[i + 1] : null
				const date = start_dt ? moment(start_dt).add(i, 'day').format('MMM D') : null
				const isToday = date && date === today
				if ((progressDay && progressDay.complete) || isCompleted) {
					checkmark = <CheckMark fill='black' width={18} height={18} />
				}
				const to = `${dayBaseLink}/day/${i + 1}`

				slides.push(
					<Link key={i + 1} to={to}>
						<div className={`day ${active}`} style={{ backgroundColor: 'white' }}>
							<div className='day-top flex-end'>
								{ checkmark }
							</div>
							<div className='day-bottom'>
								<h1>
									{ i + 1 }
								</h1>
								<h4>
									{
										showDate
											&& date
											? (
												<div
													style={{
														background: isToday ? '#6ab750' : 'white',
														color: isToday ? 'white' : '#616161',
														border: '1px solid white',
														borderRadius: '25px',
														display: 'inline-flex',
														margin: 0,
														padding: '0 5px',
													}}
												>
													{ date }
												</div>
											)
											: (
												<FormattedMessage
													id='plans.day number'
													values={{ day: i + 1 }}
												/>
											)
									}
								</h4>
							</div>
						</div>
					</Link>
				)
			}
		}

		let slider
		if (isRtl) {
			const outerStyle = {
				width: '100%',
				overflowX: 'scroll'
			}
			const innerStyle = {
				width: `${(80 * totalDays) + 30}px`
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
	totalDays: PropTypes.number.isRequired,
	progressDays: PropTypes.array,
	dayBaseLink: PropTypes.string.isRequired,
	start_dt: PropTypes.string.isRequired,
	day: PropTypes.number.isRequired,
	showDate: PropTypes.bool,
	isCompleted: PropTypes.bool,
	language_tag: PropTypes.string,
	isRtl: PropTypes.bool,
}

PlanDaySlider.defaultProps = {
	showDate: true,
	isCompleted: false,
	language_tag: 'en',
	isRtl: false,
	progressDays: null,
}

export default PlanDaySlider
