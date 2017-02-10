import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import Circle from '../../../components/Circle'
import CheckMark from '../../../components/CheckMark'

class PlanReferenceItem extends Component {
	constructor(props) {
		super(props)
		this.handleRefComplete = this.handleRefComplete.bind(this)
	}

	handleRefComplete() {
		const { handleCompleteRef, day, reference, completedRefs } = this.props
		const { usfm } = reference
		const refString = usfm.join('+')
		const isComplete = completedRefs.indexOf(refString) !== -1
		if (typeof handleCompleteRef === 'function') {
			handleCompleteRef(day, refString, !isComplete)
		}
	}

	render() {
		const { reference, day, content, link, completedRefs, iconStyle } = this.props
		const itemLink = { pathname: `${link}/ref`, query: { day, content } }
		const { usfm, human } = reference
		const refString = usfm.join('+')
		const isComplete = completedRefs.indexOf(refString) !== -1

		let icon
		if (isComplete) {
			icon = <CheckMark fill="#444444" style={iconStyle} />
		} else {
			icon = <Circle style={iconStyle} />
		}

		return (
			<li className="li-right">
				<a tabIndex={0} onClick={this.handleRefComplete}>
					{icon}
				</a>
				<Link to={itemLink}>{human}</Link>
			</li>
		)
	}
}

PlanReferenceItem.propTypes = {
	link: PropTypes.string.isRequired,
	reference: PropTypes.object.isRequired,
	day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	handleCompleteRef: PropTypes.func.isRequired,
	completedRefs: PropTypes.array.isRequired,
	iconStyle: PropTypes.object.isRequired
}

PlanReferenceItem.defaultProps = {

}

export default PlanReferenceItem
