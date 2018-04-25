import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Countdown extends Component {
	constructor(props) {
		super(props)
		this.state = {
			live: Boolean(props.initialCountdownSeconds < 1),
			secondsRemaining: props.initialCountdownSeconds
		}
	}

	componentDidMount() {
		if (typeof window !== 'undefined') {
  			this.interval = setInterval(::this.tick, 1000);
  		}
	}

	tick() {
		const { dispatch, index } = this.props
		const { secondsRemaining } = this.state
		this.setState({ secondsRemaining: secondsRemaining - 1 });
		if (secondsRemaining <= 0) {
			clearInterval(this.interval);
			this.setState({ live: true })
		}
	}

	render() {
		const { secondsRemaining, live } = this.state

		if (live) {
			return <span className="red-label">LIVE</span>
		}

		const minutes = parseInt(secondsRemaining / 60)
		const seconds = parseInt(secondsRemaining % 60)
		const remainingTime = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
		return (<span className="red-label">
			{remainingTime}
		</span>)
	}

}

Countdown.propTypes = {
	initialCountdownSeconds: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired,
	item: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired
}

export default Countdown
