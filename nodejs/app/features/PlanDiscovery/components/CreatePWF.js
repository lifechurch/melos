import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import Calendar from './Calendar'
import CalendarDay from './CalendarDay'
import LazyImage from '../../../components/LazyImage'
import SectionedHeading from '../../../components/SectionedHeading'
import Footer from '../../../components/Footer'
import { PLAN_DEFAULT } from '../../../lib/imageUtil'


class CreatePWF extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedDay: props.initialDay || new Date()
		}
	}

	handleDaySelect = (day) => {
		this.setState({
			selectedDay: day
		})
	}

	handleCreateSubscription = () => {
		const { onHandleSubscribe } = this.props
		const { selectedDay } = this.state
		if (selectedDay) {
			if (typeof onHandleSubscribe === 'function') {
				onHandleSubscribe(selectedDay)
			}
		}
		return false
	}

	renderDay = ({ day }) => {
		const { selectedDay } = this.state
		const isInPast = (moment(day).dayOfYear() < moment(new Date()).dayOfYear())

		return (
			<CalendarDay
				customClass={
					`${
						selectedDay
							&& (moment(selectedDay).dayOfYear() === moment(day).dayOfYear())
							? 'yv-active'
							: ''
						}`
				}
				date={day.getDate()}
				disabled={isInPast}
				handleClick={this.handleDaySelect.bind(this, day)}
			/>
		)
	}

	render() {
		const { planImgSrc, backPath, isEditingDate } = this.props
		const { selectedDay } = this.state

		return (
			<div className='pwf-flow pwf-create'>
				<SectionedHeading
					left={
						<Link
							className='plans vertical-center'
							to={backPath}
						>
							&larr;
						</Link>
					}
					right={
						<a
							tabIndex={0}
							className='text-right green'
							onClick={this.handleCreateSubscription}
						>
							{
								isEditingDate
									? <FormattedMessage id='done' />
									: <FormattedMessage id='invite friends' />
							}
						</a>
					}
				>
					{
						isEditingDate
							? <FormattedMessage id='change date' />
							: <FormattedMessage id='start plan when' />
					}
				</SectionedHeading>
				<div className='gray-background content text-center'>
					<div className='columns medium-8 small-12 small-centered'>
						<div className='horizontal-center' style={{ height: '150px', marginBottom: '30px' }}>
							<LazyImage
								alt='plan-image'
								src={planImgSrc}
								width={250}
								height={150}
								placeholder={<img alt='plan' src={PLAN_DEFAULT} />}
							/>
						</div>
						<FormattedMessage id='future start blurb' />
						<Calendar showFullWeeks={false}>
							{ this.renderDay }
						</Calendar>
					</div>
				</div>
				<Footer>
					<div>{ selectedDay ? moment(selectedDay).format('dddd, MMMM Do YYYY') : null }</div>
					<a
						tabIndex={0}
						className='solid-button green margin-left-auto'
						onClick={this.handleCreateSubscription}
						style={{ marginBottom: 0 }}
					>
						{
							isEditingDate
								? <FormattedMessage id='done' />
								: <FormattedMessage id='invite friends' />
						}
					</a>
				</Footer>
			</div>
		)
	}
}

CreatePWF.propTypes = {
	planImgSrc: PropTypes.string,
	backPath: PropTypes.string,
	onHandleSubscribe: PropTypes.func.isRequired,
	isEditingDate: PropTypes.bool,
}

CreatePWF.defaultProps = {
	planImgSrc: null,
	backPath: null,
	isEditingDate: false,
}

export default CreatePWF
