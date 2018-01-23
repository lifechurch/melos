import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { SQUARE } from '@youversion/utils/lib/images/readingPlanDefault'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'

function PlanListItem(props) {
	const { name, link, src, subContent } = props

	return (
		<div className='row subscription collapse'>
			<div className='small-12 columns'>
				<div className='search_thumbnail'>
					<Link to={link} className='subscription-title'>
						<div style={{ height: '80px' }}>
							<LazyImage
								src={src}
								width={80}
								height={80}
								placeholder={<img
									alt='plan'
									className='subscription_thumbnail radius'
									src={SQUARE}
								/>}
								imgClass='subscription_thumbnail radius'
							/>
						</div>
					</Link>
				</div>
				<div className='subscription-info' style={{ marginTop: 0 }}>
					<Link to={link} className='subscription-title'>
						<h3 className='plan-title'>{ name }</h3>
					</Link>
					<div className='plan-length'>
						{ subContent }
					</div>
				</div>
			</div>
		</div>
	)
}

PlanListItem.propTypes = {
	name: PropTypes.string,
	link: PropTypes.string,
	src: PropTypes.string,
	subContent: PropTypes.node,
}

PlanListItem.defaultProps = {
	name: null,
	link: null,
	src: null,
	subContent: null,
}

export default PlanListItem
