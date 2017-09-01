import React, { PropTypes, Component } from 'react'
import PLACEHOLDER_ANIMATIONS from './PLACEHOLDER_ANIMATIONS'


class Placeholder extends Component {

	shouldComponentUpdate() {
		return false
	}

	render() {
		const {
			fill,
			background,
			childSpacing,
			height,
			width,
			children,
			className,
			animation,
		} = this.props

		return (
			<div
				className={[
					'placeholder',
					`placeholder-animation-${animation} ${className}`,
					'vertical-center',
					'flex-wrap'
				].join(' ')}
				style={{ width, height, background }}
			>
				{
						React.Children.map(children, (c) => {
							return (
								<div className={`vertical-center ${c.props.className ? c.props.className : ''}`}>
									{
										React.cloneElement(c, {
											height,
											fill,
										})
									}
									<div
										style={{
											width: `${childSpacing}`,
											background: `${fill}`,
											height
										}}
									/>
								</div>
							)
						})
					}
			</div>
		)
	}
}

Placeholder.propTypes = {
	fill: PropTypes.string,
	className: PropTypes.string,
	background: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	animation: PropTypes.oneOf(PLACEHOLDER_ANIMATIONS),
}

Placeholder.defaultProps = {
	fill: 'white',
	background: null,
	height: '200px',
	width: '100%',
	childSpacing: '15px',
	animation: 'shimmer',
	className: '',
}

export default Placeholder
