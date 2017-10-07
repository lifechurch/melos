import React, { PropTypes } from 'react'
import VotdText from '../features/Moments/components/votd/VotdText'
import VotdImage from '../features/Moments/components/votd/VotdImage'

const VOTDView = (props) => {
	const { params: { day = null } } = props

	return (
		<div className='gray-background horizontal-center' style={{ padding: '50px 0' }}>
			<div className='large-5'>
				<div style={{ padding: '25px 0' }}>
					<VotdText dayOfYear={day} />
				</div>
				<div style={{ padding: '25px 0' }}>
					<VotdImage dayOfYear={day} />
				</div>
			</div>
		</div>
	)
}

VOTDView.propTypes = {
	params: PropTypes.object.isRequired,
}

VOTDView.defaultProps = {

}

export default VOTDView
