import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import Viewport from '../../../../lib/viewportUtils'
import { PLAN_DEFAULT } from '../../../../lib/imageUtil'
import LazyImage from '../../../../components/LazyImage'
import CheckMark from '../../../../components/CheckMark'
import NavArrows from '../../../Bible/components/content/NavArrows'
import StickyHeader from '../../../../components/StickyHeader'
import ResponsiveContainer from '../../../../components/ResponsiveContainer'

class PlanNavigation extends Component {

	constructor(props) {
		super(props)
		this.state = {
			bottomPos: '45%'
		}
	}

	componentDidMount() {
		this.viewport = new Viewport()
		this.styleArrows()
		this.viewport.registerListener('resize', this.styleArrows)
	}

	componentDidUpdate(prevProps) {
		const { contentNum, updateStyle } = this.props
		if (contentNum !== prevProps.contentNum || (updateStyle && updateStyle !== prevProps.updateStyle)) {
			this.styleArrows()
		}
	}

	styleArrows = () => {
		if (document && typeof window !== 'undefined') {
			window.scrollTo(0, 0)
			const content = document.getElementsByClassName('plan-reader-content')[0]
			if (content) {
				const contentPos = this.viewport.getElement(content)
				const viewport = this.viewport.getViewport()
				// if the content is shorter than the viewport
				// let's set the arrows in the middle of the content div
				if (contentPos.bottom < viewport.height) {
					this.setState({
						bottomPos: `${(viewport.height - contentPos.bottom) + ((contentPos.height) / 2)}px`
					})
				} else {
					this.setState({
						bottomPos: '45%'
					})
				}
			}
		}
	}


	render() {
		const {
			planImgUrl,
			planName,
			day,
			next,
			previous,
			subLink,
			contentNum,
			totalSegments,
			showCheckmark,
			onHandleComplete,
			isRtl,
		} = this.props
		const { bottomPos } = this.state

		let customNext = null
		if (showCheckmark) {
			customNext = (
				<div className='checkmark circle-buttons vertical-center horizontal-center'>
					<CheckMark fill='white' width={27} height={26} classes='reader-arrow' />
				</div>
			)
		}

		return (
			<div className='plan-nav'>
				<StickyHeader verticalOffset={70} translationDistance='70px' stackOrder={1}>
					<div className='plan-nav-header' style={{ width: '100%' }}>
						<div className='nav-content columns large-6 medium-8 medium-centered'>
							<Link to={subLink}>
								<LazyImage
									alt='plan-image'
									src={planImgUrl}
									width={40}
									height={40}
									customClass='nav-img img-left'
									placeholder={<img alt='plan' src={PLAN_DEFAULT} />}
								/>
							</Link>
							<div className='plan-info'>
								<Link to={subLink}>
									<div className='nav-title'>{ planName }</div>
								</Link>
								<div className='nav-length'>
									<FormattedMessage id="plans.day number" values={{ day }} />
									&nbsp;
									&bull;
									&nbsp;
									<FormattedMessage id="plans.which reading" values={{ current: contentNum, total: totalSegments }} />
								</div>
							</div>
						</div>
					</div>
				</StickyHeader>
				<ResponsiveContainer>
					<NavArrows
						isRtl={isRtl}
						nextURL={next}
						previousURL={previous}
						customNext={customNext}
						onNextClick={onHandleComplete}
						bottomPos={bottomPos}
					/>
				</ResponsiveContainer>
			</div>
		)
	}
}

PlanNavigation.propTypes = {
	planImgUrl: PropTypes.string.isRequired,
	planName: PropTypes.string.isRequired,
	day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	next: PropTypes.string,
	previous: PropTypes.string,
	isRtl: PropTypes.bool.isRequired,
	subLink: PropTypes.string,
	contentNum: PropTypes.number.isRequired,
	totalSegments: PropTypes.number.isRequired,
	showCheckmark: PropTypes.bool.isRequired,
	onHandleComplete: PropTypes.func,
	updateStyle: PropTypes.bool,
}

PlanNavigation.defaultProps = {
	next: null,
	previous: null,
	subLink: '',
	onHandleComplete: () => {},
	updateStyle: false,
}

export default PlanNavigation
