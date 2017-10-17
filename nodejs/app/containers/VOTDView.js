import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import VotdText from '../features/Moments/components/types/VotdText'
import VotdImage from '../features/Moments/components/types/VotdImage'
import ShareSheet from '../widgets/ShareSheet/ShareSheet'
import PlansRelatedToReference from '../widgets/PlansRelatedToReference'


const VOTDView = (props) => {
	const { location: { query }, moments } = props
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
				<div style={{ padding: '25px 0' }}>
					<PlansRelatedToReference
						usfm={moments
							&& moments.pullVotd(day)
							&& moments.pullVotd(day).usfm
						}
					/>
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

function mapStateToProps(state) {
	return {
		moments: getMomentsModel(state)
	}
}

export default connect(mapStateToProps, null)(VOTDView)
