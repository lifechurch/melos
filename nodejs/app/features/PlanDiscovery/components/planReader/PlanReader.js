import React, { Component, PropTypes } from 'react'
import { routeActions } from 'react-router-redux'
import PlanNavigation from './PlanNavigation'
// utils
import { getVerseAudioTiming } from '../../../../lib/readerUtils'
import { selectImageFromList } from '../../../../lib/imageUtil'

class PlanReader extends Component {


	render() {
		const {
			plan,
			day,
			contentNum,
			totalSegments,
			previousPath,
			nextPath,
			subLink,
			showCheckmark,
			handleContentCheck,
			bible,
			hosts,
			auth,
			dispatch,
			isRtl,
			showFullChapter,
			updateStyle,
			children
		} = this.props

		return (
			<div>
				<PlanNavigation
					planName={plan ? plan.name.default : null}
					planImgUrl={plan && plan.images ?
						selectImageFromList({
							images: plan.images,
							width: 640,
							height: 320
						}).url :
						null
					}
					day={day}
					previous={previousPath}
					next={nextPath}
					subLink={subLink}
					contentNum={contentNum}
					totalSegments={totalSegments}
					showCheckmark={showCheckmark}
					onHandleComplete={handleContentCheck}
					isRtl={isRtl()}
					// if we're rendering the full chapter from button click, let's
					// update the arrow positioning
					updateStyle={updateStyle}
				/>
				<div className='row plan-reader-content'>
					<div className='columns large-6 medium-8 medium-centered'>
						{ children }
					</div>
				</div>
			</div>
		)
	}
}

PlanReader.propTypes = {
	plan: PropTypes.object.isRequired,
	bible: PropTypes.object.isRequired,
	showFullChapter: PropTypes.bool,
	dispatch: PropTypes.func.isRequired,
	hosts: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
}

PlanReader.defaultProps = {
	showFullChapter: false
}

export default PlanReader
