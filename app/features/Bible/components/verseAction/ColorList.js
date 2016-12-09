import React, { Component, PropTypes } from 'react'
import Slider from 'react-slick'
import CarouselArrow from '../../../../components/Carousel/CarouselArrow'
import EllipsisMoreIcon from '../../../../components/EllipsisMoreIcon'
import XMark from '../../../../components/XMark'
import Color from './Color'
import { SliderPicker } from 'react-color'

class ColorList extends Component {

	constructor(props) {
		super(props)
		this.state = {
			screen: 'carousel',
			sliderColor: props.list[0],
		}

		this.selectColor = ::this.selectColor
		this.handleScreenChange = ::this.handleScreenChange
	}

	selectColor(color) {
		const { onClick } = this.props
		if (typeof onClick == 'function') {
			onClick(color)
		}
		this.setState({
			sliderColor: color,
		})
	}

	handleScreenChange() {
		this.setState({
			screen: this.state.screen == 'carousel' ? 'picker' : 'carousel',
		})
	}

	render() {
		const { list, type } = this.props
		const { selectedColor, dropdown, sliderColor, screen } = this.state

    let settings = {
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

		let colors, content = null

		if (list) {
			colors = list.map((color, index) => {
				return (
					<div key={color}>
						<Color
							color={color}
							onSelect={this.selectColor.bind(undefined, color)}
						/>
					</div>
				)
			})
			colors.push (
				<div key={'custom-color'} className='custom-color-icon color' onClick={this.handleScreenChange}>
					<EllipsisMoreIcon />
				</div>
			)
		}

		if (screen == 'carousel') {
			content = (
				<Slider {...settings}>
					{ colors }
				</Slider>
			)
		} else if (screen == 'picker') {
			content = (
				<div className='custom-color-picker'>
					<SliderPicker color={sliderColor} onChange={this.selectColor.bind(undefined)} />
					<div className='buttons'>
						<Color color={sliderColor} onClick={this.selectColor.bind(undefined, sliderColor)}/>
						<XMark onClick={this.handleScreenChange} width={17} height={17} />
					</div>
				</div>
			)
		}

		return (
			<div className='color-list carousel-standard'>
				{ content }
			</div>
		)
	}
}

ColorList.propTypes = {
	list: React.PropTypes.array.isRequired,
	onClick: React.PropTypes.func,
}

export default ColorList