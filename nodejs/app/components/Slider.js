import React, { Component, PropTypes } from 'react'

class Slider extends Component {
	constructor(props) {
		super(props)
		this.state = {
			sliderWidth: 0,
		}
		this.refsList = []
	}

	componentDidUpdate() {
		const { sliderWidth } = this.state
		if (sliderWidth === 0) {
			this.onNextFrame(this.calculateSliderWidth)
		}
	}

	// we need to wait for our children to render first and
	// then calculate the width of all the children
	// see: https://stackoverflow.com/questions/26556436/react-after-render-code
	onNextFrame = (callback) => {
		setTimeout(() => {
			window.requestAnimationFrame(callback)
		}, 0)
	}

	calculateSliderWidth = () => {
		if (this.refsList && this.refsList.length > 0) {
			let sliderWidth = 0
			this.refsList.forEach((ref) => {
				if (ref && ref.offsetWidth) {
					sliderWidth += ref.offsetWidth
				}
			})
			if (sliderWidth !== 0) {
				this.setState({ sliderWidth })
			}
		}
	}

	render() {
		const { children } = this.props
		const { sliderWidth } = this.state

		return (
			<div className='yv-slider horizontal-overflow-scroll'>
				<div
					className='vertical-center'
					style={{ width: `${sliderWidth}px` }}
				>
					{
						React.Children.map(children, (child) => {
							return (
								<div
									ref={(el) => { this.refsList.push(el) }}
									className='yv-slider-child'
								>
									{ child }
								</div>
							)
						})
					}
				</div>
			</div>
		)
	}
}

Slider.propTypes = {

}

Slider.defaultProps = {

}

export default Slider
