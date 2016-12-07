import React, { Component, PropTypes } from 'react'
import Slider from 'react-slick'
import CarouselArrow from '../../../../components/Carousel/CarouselArrow'
import Color from './Color'

class ColorList extends Component {

	constructor(props) {
		super(props)
		this.state = {
			selectedColor: null,
			dropdown: false,
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

	handleDropdownClick() {
		this.setState({
			dropdown: !this.state.dropdown,
		})
	}

	render() {
		const { list, type } = this.props
		const { selectedColor, dropdown } = this.state

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

		let colors, content = null

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

			if (type == 'grid') {
				<div>
					<div onClick={this.handleDropdownClick}>
						{
							selectedColor
							?
							colors[selectedColor]
							:
							o
						}
					</div>
					<DropdownTransition show={dropdown}>
						<div>

						</div>
					</DropdownTransition>
				</div>
			} else if (type == 'carousel') {
				content = (
					<Slider {...settings}>
						{ colors }
					</Slider>
				)
			}
		}


		return (
			<div className='color-list carousel-standard'>
				{ content }
			</div>
		)
	}
}

ColorList.propTypes = {
	colors: React.PropTypes.array.isRequired,
	selectedColor: React.PropTypes.number,
}

export default ColorList