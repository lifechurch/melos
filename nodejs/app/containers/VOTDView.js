import React, { PropTypes } from 'react'
import VotdText from '../features/Moments/components/types/VotdText'
import VotdImage from '../features/Moments/components/types/VotdImage'
import ShareSheet from '../widgets/ShareSheet/ShareSheet'


const VOTDView = (props) => {
	const { location: { query } } = props
	const day = query && query.day

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
			<ShareSheet />
		</div>
	)
}

VOTDView.propTypes = {
	location: PropTypes.object.isRequired,
}

VOTDView.defaultProps = {

}

export default VOTDView
