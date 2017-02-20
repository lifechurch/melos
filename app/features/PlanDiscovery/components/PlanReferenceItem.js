import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import Circle from '../../../components/Circle'
import CheckMark from '../../../components/CheckMark'
import { getSelectionString } from '../../../lib/usfmUtils'

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
		const { reference, day, link, bibleLink, completedRefs, iconStyle, mode } = this.props
		const { usfm, human } = reference
		const refString = usfm.join('+')
		const isComplete = completedRefs.indexOf(refString) !== -1
		const itemLink = { pathname: `${link}/ref`, query: { day } }

		let itemBibleLink
		if (mode === 'sample') {
			if (usfm[0].split('.').length === 2) {
				// Two pieces indicates full chapter
				itemBibleLink = usfm[0]
			} else {
				// Three pieces indicates verses
				itemBibleLink = `${bibleLink}/${usfm[0].split('.').slice(0, 2).join('.')}.${getSelectionString(usfm)}`
			}
		}

		let icon
		if (isComplete) {
			icon = <CheckMark fill="#444444" style={iconStyle} />
		} else {
			icon = <Circle style={iconStyle} />
		}

		return (
			<li className="li-right">
				{mode === 'subscription' &&
					<a tabIndex={0} onClick={this.handleRefComplete}>
						{icon}
					</a>
				}
				{ mode === 'subscription'
					? <Link to={itemLink}>{human}</Link>
					: <a tabIndex={0} href={itemBibleLink}>{human}</a>
				}
			</li>
		)
	}
}

PlanReferenceItem.propTypes = {
	link: PropTypes.string.isRequired,
	bibleLink: PropTypes.string.isRequired,
	reference: PropTypes.object.isRequired,
	day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	handleCompleteRef: PropTypes.func.isRequired,
	completedRefs: PropTypes.array.isRequired,
	iconStyle: PropTypes.object.isRequired,
	mode: PropTypes.oneOf(['sample', 'subscription', 'about']).isRequired
}

PlanReferenceItem.defaultProps = {

}

export default PlanReferenceItem
