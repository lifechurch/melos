import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import Viewport from '../../../../lib/viewportUtils'
import CheckMark from '../../../../components/CheckMark'
import NavArrows from '../../../Bible/components/content/NavArrows'
import Header from '../../../Bible/components/header/Header'


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
		const { whichContent, updateStyle } = this.props
		if (whichContent !== prevProps.whichContent || (updateStyle && updateStyle !== prevProps.updateStyle)) {
			this.styleArrows()
		}
	}

	styleArrows = () => {
		if (document && typeof window !== 'undefined') {
			const content = document.getElementsByClassName('plan-reader-content')[0]
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


	render() {
		const {
			planImgUrl,
			planName,
			day,
			next,
			previous,
			dayBasePath,
			whichContent,
			totalContentsNum,
			isFinalContent,
			onHandleComplete,
			localizedLink
		} = this.props
		const { bottomPos } = this.state

		let customNext = null
		if (isFinalContent) {
			customNext = (
				<div className='checkmark circle-buttons vertical-center horizontal-center'>
					<CheckMark fill='white' width={27} height={26} classes='reader-arrow' />
				</div>
			)
		}

		return (
			<div className='plan-nav'>
				<Header sticky={true} classes={'plan-nav-header'}>
					<div className='nav-content columns large-6 medium-8 medium-centered'>
						<Link to={dayBasePath}>
							<img alt='reading plan' className='nav-img img-left' src={planImgUrl} />
						</Link>
						<div className='plan-info'>
							<Link to={dayBasePath}>
								<div className='nav-title'>{ planName }</div>
							</Link>
							<div className='nav-length'>
								<FormattedMessage id="plans.day number" values={{ day }} />
								&nbsp;
								&bull;
								&nbsp;
								<FormattedMessage id="plans.which reading" values={{ current: whichContent, total: totalContentsNum }} />
							</div>
						</div>
					</div>
				</Header>
				<NavArrows
					localizedLink={localizedLink}
					nextURL={next}
					previousURL={previous}
					customNext={customNext}
					onNextClick={onHandleComplete}
					bottomPos={bottomPos}
				/>
			</div>
		)
	}
}

PlanNavigation.propTypes = {
	planImgUrl: PropTypes.string.isRequired,
	planName: PropTypes.string.isRequired,
	day: PropTypes.oneOfType(['string', 'number']).isRequired,
	next: PropTypes.string,
	previous: PropTypes.string,
	dayBasePath: PropTypes.string,
	whichContent: PropTypes.number.isRequired,
	totalContentsNum: PropTypes.number.isRequired,
	isFinalContent: PropTypes.bool.isRequired,
	onHandleComplete: PropTypes.func,
	localizedLink: PropTypes.func.isRequired,
	updateStyle: PropTypes.bool,
}

PlanNavigation.defaultProps = {
	next: null,
	previous: null,
	dayBasePath: '',
	onHandleComplete: () => {},
	updateStyle: false,
}

export default PlanNavigation
