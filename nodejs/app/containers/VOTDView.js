import React, { Component, PropTypes } from 'react'
import VotdText from '../features/Moments/components/votd/VotdText'
import VotdImage from '../features/Moments/components/votd/VotdImage'

class VOTDView extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {

	}

	componentDidUpdate(prevProps, prevState) {

	}

	render() {
		// const { } = this.props

		return (
			<div className='gray-background horizontal-center' style={{ padding: '50px 0' }}>
				<div className='large-5'>
					<div style={{ padding: '25px 0' }}>
						<VotdText />
					</div>
					<div style={{ padding: '25px 0' }}>
						<VotdImage />
					</div>
				</div>
			</div>
		)
	}
}

VOTDView.propTypes = {

}

VOTDView.defaultProps = {

}

export default VOTDView
