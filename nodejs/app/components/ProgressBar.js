import React, { Component, PropTypes } from 'react'


class ProgressBar extends Component {

	constructor(props) {
		super(props)
		this.state = {
			percentComplete: 0,
		}
	}

	componentDidMount() {
		const { percentComplete } = this.props
		// delay setting the progress completion to make it animate
		setTimeout(() => {
			this.setState({
				percentComplete,
			})
		})
	}


	componentWillReceiveProps(nextProps) {
		const { percentComplete } = this.state
		if (
			nextProps.percentComplete
			&& nextProps.percentComplete !== percentComplete
		) {
			this.setState({ percentComplete: nextProps.percentComplete })
		}
	}

	render() {
		const {
		width,
		height,
		classes,
		color,
		transitionSpeed,
		backgroundColor,
		borderColor,
		isRtl,
	} = this.props
		const { percentComplete } = this.state

		const progressTransform = isRtl ?
			`translate(${(100 - percentComplete)}%, 0)` :
			`translate(${-1 * (100 - percentComplete)}%, 0)`

		const progressBarStyle = {
			height: `${height}`,
			width: `${width}`,
			borderRadius: '5px',
			overflow: 'hidden',
			border: `solid 1px ${borderColor || color}`,
			backgroundColor: `${backgroundColor}`
		}
		const progressStyle = {
			backgroundColor: `${color}`,
			height: '100%',
			borderRadius: '2px',
			width: '100%',
			transform: progressTransform,
			transition: `transform ${transitionSpeed}s cubic-bezier(0.42, 1, .16, .93)`,
		}

		return (
			<div className={`progress-bar ${classes}`} style={progressBarStyle}>
				<div
					className={'progress'}
					style={progressStyle}
				/>
			</div>
		)
	}
}

ProgressBar.propTypes = {
	color: PropTypes.string,
	backgroundColor: PropTypes.string,
	borderColor: PropTypes.string,
	height: PropTypes.string,
	width: PropTypes.string,
	classes: PropTypes.string,
	transitionSpeed: PropTypes.number,
	percentComplete: PropTypes.number,
	isRtl: PropTypes.bool,
}

ProgressBar.defaultProps = {
	color: 'white',
	backgroundColor: 'transparent',
	borderColor: null,
	height: '7px',
	width: '100%',
	classes: '',
	transitionSpeed: 1.5,
	percentComplete: 0,
	isRtl: false,
}

export default ProgressBar