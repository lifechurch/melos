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
			isRtl,
			updateStyle,
			customClass,
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
				<div className={`row plan-reader-content ${customClass}`}>
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
	children: PropTypes.node.isRequired,
	customClass: PropTypes.string,
}

PlanReader.defaultProps = {
	showFullChapter: false,
	customClass: null,
}

export default PlanReader
