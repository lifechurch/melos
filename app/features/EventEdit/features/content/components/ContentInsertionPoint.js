import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ActionCreators from '../actions/creators'

class ContentInsertionPoint extends Component {
	constructor(props) {
		super(props)
		this.state = { show: false, on: props.index === props.insertionPoint }
	}

	handleMouseEnter(mouseEvent) {
		if (!this.state.on) {
			this.setState({ show:true })
		}
	}

	handleMouseLeave(mouseEvent) {
		if (!this.state.on) {
			this.setState({ show:false })
		}
	}

	handleClick(clickEvent) {
		const { dispatch, index, insertionPoint } = this.props
		if (insertionPoint === index) {
			dispatch(ActionCreators.setInsertionPoint(0))
		} else {
			dispatch(ActionCreators.setInsertionPoint(index))
		}
	}

	componentWillReceiveProps(props) {
		this.setState({ show: props.index === props.insertionPoint, on: props.index === props.insertionPoint })
	}

	render() {
		let insertionPoint = null
		if (this.state.show) {
			if (this.state.on) {
				insertionPoint = <a className='solid-button green' onClick={::this.handleClick}>Hide Me</a>
			} else {
				insertionPoint = <a className='solid-button blue' onClick={::this.handleClick}>Show Me</a>
			}
		}

		return (
			<div className='content-insertion-point' onMouseEnter={::this.handleMouseEnter} onMouseLeave={::this.handleMouseLeave}>
				<ReactCSSTransitionGroup transitionName='content' transitionEnterTimeout={50} transitionLeaveTimeout={300}>
					{insertionPoint}
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}

ContentInsertionPoint.propTypes = {
	index: React.PropTypes.number.isRequired
}

export default ContentInsertionPoint