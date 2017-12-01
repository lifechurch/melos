import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import Heading from '@youversion/melos/dist/components/typography/Heading1'
import SectionedLayout from '@youversion/melos/dist/components/layouts/SectionedLayout'
import Calendar from './Calendar'
import CalendarDay from './CalendarDay'
import LazyImage from '../../../components/LazyImage'
import Footer from '../../../components/Footer'


class CreatePWF extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedDay: props.initialDay || moment().add(1, 'days')
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
		const isInPast = (moment(day).startOf('day') < moment(new Date()).startOf('day'))

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
				<div className='yv-large-8 yv-small-11 centered' style={{ marginBottom: '25px' }}>
					<SectionedLayout
						left={
							<Link
								className='vertical-center'
								to={backPath}
							>
								&larr;
							</Link>
						}
					>
						{
							isEditingDate
								? <Heading><FormattedMessage id='change date' /></Heading>
								: <Heading><FormattedMessage id='start plan when' /></Heading>
						}
					</SectionedLayout>
				</div>
				<div className='gray-background content text-center'>
					<div className='yv-large-4 yv-medium-6 yv-small-11 centered white'>
						<LazyImage
							alt='Devotional'
							width='100%'
							style={{ width: '100%', marginBottom: '30px' }}
							src={planImgSrc}
						/>
						<div className='centered' style={{ width: '90%' }}>
							<FormattedMessage id='future start blurb' />
						</div>
						<Calendar showFullWeeks={false}>
							{ this.renderDay }
						</Calendar>
					</div>
				</div>
				<Footer customClass='space-between'>
					<div>{ selectedDay ? moment(selectedDay).format('dddd, MMMM Do YYYY') : null }</div>
					<a
						tabIndex={0}
						className='solid-button green'
						onClick={this.handleCreateSubscription}
						style={{ margin: '0 0 0 5px', lineHeight: 1.1 }}
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