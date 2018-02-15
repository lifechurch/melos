import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import CarouselArrow from '../../../../components/Carousel/CarouselArrow'
import Ellipsis from '../../../../components/icons/Ellipsis'
import XMark from '../../../../components/XMark'
import Color from './Color'
// import { SliderPicker } from 'react-color'
import SliderPicker from '../../../../../node_modules/react-color/lib/components/slider/Slider'

class ColorList extends Component {

	constructor(props) {
		super(props)
		this.state = {
			screen: 'carousel',
			sliderColor: props.list[0],
		}

	}

	/**
	 * handle Color click
	 *
	 * @param      {string}  color   hex value
	 */
	selectColor = (color) => {
		const { onClick } = this.props
		if (typeof onClick === 'function') {
			onClick(color)
		}
	}

	deleteColor = (color) => {
		const { deleteColor } = this.props
		if (typeof deleteColor === 'function') {
			deleteColor(color)
		}
	}

	/**
	 * when custom color slider changes
	 *
	 * @param      {object}  color   The color object from the SliderPicker component
	 */
	handleColorChange = (color) => {
		if (color && color.hex) {
			this.setState({
				sliderColor: color.hex,
			})
		}
	}

	/**
	 * toggle between the color carousel and the custom color picker
	 */
	handleScreenChange = () => {
		this.setState({
			screen: this.state.screen === 'carousel' ? 'picker' : 'carousel',
		})
	}


	render() {
		const { list, deletableColors, isRtl } = this.props
		const { sliderColor, screen } = this.state

		const settings = {
			centerMode: false,
			infinite: false,
			variableWidth: true,
			slidesToScroll: 6,
			arrows: true,
			prevArrow: <CarouselArrow dir='left' fill='gray' width={15} height={15} />,
			nextArrow: <CarouselArrow dir='right' fill='gray' width={15} height={15} />,
			responsive: [ {
				breakpoint: 524, settings: { arrows: false, slidesToShow: 1 }
			} ]
		}

		let content = null
		const colors = []

		if (Array.isArray(deletableColors)) {
			deletableColors.forEach((color) => {
				colors.push(
					<div key={`${color}-delete`}>
						<Color
							color={color}
							deleteColor={this.deleteColor}
						/>
					</div>
				)
			})
		}
		if (Array.isArray(list)) {
			list.forEach((color) => {
				colors.push(
					<div key={color}>
						<Color
							color={color}
							onClick={this.selectColor}
						/>
					</div>
				)
			})
			// push custom picker trigger as the last 'color' in the list
			colors.push(
				<a tabIndex={0} key='custom-color' className='custom-color-icon color' onClick={this.handleScreenChange}>
					<Ellipsis className='vertical-center' />
				</a>
			)
		}

		if (screen === 'carousel') {
			let slider
			if (isRtl) {
				const outerStyle = {
					width: '100%',
					overflowX: 'scroll'
				}
				const innerStyle = {
					width: `${(37 * colors.length)}px`
				}

				slider = (
					<div className='rtl-faux-slider' style={outerStyle}>
						<div style={innerStyle}>
							{ colors }
						</div>
					</div>
				)
			} else {
				slider = <Slider {...settings}>{ colors }</Slider>
			}
			content = (
				<div className='carousel-standard'>
					{ slider }
				</div>
			)
		} else if (screen === 'picker') {
			content = (
				<div className='custom-color-picker'>
					<div className='slider small-10'>
						<SliderPicker color={sliderColor} onChange={this.handleColorChange} />
					</div>
					<div className='buttons small-2'>
						<Color color={sliderColor} onClick={this.selectColor} />
						<XMark onClick={this.handleScreenChange} width={17} height={17} />
					</div>
				</div>
			)
		}

		return (
			<div className='color-list'>
				{ content }
			</div>
		)
	}
}

ColorList.propTypes = {
	list: PropTypes.array.isRequired,
	deletableColors: PropTypes.array,
	onClick: PropTypes.func,
	deleteColor: PropTypes.func,
	isRtl: PropTypes.bool,
}

ColorList.defaultProps = {
	isRtl: false,
	deletableColors: null,
	onClick: null,
	deleteColor: null,
}

export default ColorList
