import React, { Component, PropTypes } from 'react'
import HeartIcon from '../../../components/Icons/Heart'

class MomentFooter extends Component {
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
		const { onLike } = this.props

		return (
			<div className='moment-footer'>
				{
					onLike &&
					<a tabIndex={0} className='margin-left-auto' onClick={onLike}>
						<HeartIcon />
					</a>
				}
			</div>
		)
	}
}

MomentFooter.propTypes = {

}

MomentFooter.defaultProps = {

}

export default MomentFooter
