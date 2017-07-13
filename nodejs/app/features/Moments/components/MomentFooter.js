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
		const { onLike, filledLike, likes } = this.props

		return (
			<div className='moment-footer'>
				{
					onLike &&
					<div className='margin-left-auto vertical-center'>
						{
							likes &&
							<a className='font-grey' style={{ marginRight: '5px' }}>
								{ likes }
							</a>
						}
						<a tabIndex={0} onClick={onLike}>
							<HeartIcon fill={filledLike ? '#DA1000' : '#979797'} />
						</a>
					</div>
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
