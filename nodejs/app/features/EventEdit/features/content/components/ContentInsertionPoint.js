import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ActionCreators from '../actions/creators'
import { FormattedMessage } from 'react-intl'
import CheckImage from '../../../../../../images/check.png'
import ThinPlusImage from '../../../../../../images/thin-plus.png'

class ContentInsertionPoint extends Component {
	constructor(props) {
		super(props)
		this.state = { show: false, on: props.index === props.insertionPoint }
	}

	handleMouseEnter(mouseEvent) {
		if (!this.state.on) {
			this.setState({ show: true })
		}
	}

	handleMouseLeave(mouseEvent) {
		if (!this.state.on) {
			this.setState({ show: false })
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
				insertionPoint = (<div>
					<div className='content-insertion-line' />
					<a className='solid-button green' onClick={::this.handleClick}>
						<img src={CheckImage} />
						<FormattedMessage id="features.EventEdit.features.content.components.ContentInsertionPoint.title" />
					</a>
				</div>)

			} else {
				insertionPoint = (<div>
					<div className='content-insertion-line' />
					<a className='hollow-button green' onClick={::this.handleClick}>
						<img src={ThinPlusImage} />
						<FormattedMessage id="features.EventEdit.features.content.components.ContentInsertionPoint.title" />
					</a>
				</div>)
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
