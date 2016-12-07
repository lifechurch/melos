import React, { Component, PropTypes } from 'react'
import Slider from 'react-slick'
import CarouselArrow from '../../../../components/Carousel/CarouselArrow'
import Color from './Color'

class ColorList extends Component {

	constructor(props) {
		super(props)
		this.state = {
			selectedColor: null,
		}
	}

	componentWillReceiveProps(nextProps) {
		const { selectedColor } = this.props
		if (selectedColor !== nextProps.selectedColor) {
			this.setState({
				selectedColor: nextProps.selectedColor,
			})
		}
	}

	selectColor(index) {
		this.setState({
			selectedColor: index,
		})
	}

	render() {
		const { list } = this.props
		const { selectedColor } = this.state

    let settings = {
			centerMode: false,
      infinite: false,
      variableWidth: true,
      slidesToScroll: 4,
      arrows: true,
      prevArrow: <CarouselArrow dir='left' fill='gray' width={15} height={15} />,
      nextArrow: <CarouselArrow dir='right' fill='gray' width={15} height={15} />,
      responsive: [ {
      	breakpoint: 524, settings: { arrows: false, slidesToShow: 1 }
      } ]
		}

		let colors, slider = null

		if (list) {
			colors = list.map((color, index) => {
				return (
					<div>
						<Color
							color={color}
							onSelect={this.selectColor.bind(this, index)}
						/>
					</div>
				)
			})
			slider = (
				<Slider {...settings}>
					{ colors }
				</Slider>
			)
		}

		return (
			<div className='color-list carousel-standard'>
				{ slider }
			</div>
		)
	}
}

ColorList.propTypes = {
	colors: React.PropTypes.array.isRequired,
	selectedColor: React.PropTypes.number,
}

export default ColorList