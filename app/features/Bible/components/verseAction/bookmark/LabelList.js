import React, { Component, PropTypes } from 'react'
import LabelPill from './LabelPill'

class LabelList extends Component {

	render() {
		const { list, onSelect, filteredBy } = this.props

		let labels = null

		if (list) {
			labels = list.map((label, index) => {
				return (
					<LabelPill
						label={label.label}
						count={label.count}
						canDelete={false}
						onSelect={onSelect}
					/>
				)
			})
		}

		return (
			<div className='label-list'>
				{ labels }
			</div>
		)
	}
}

LabelList.propTypes = {

}

export default LabelList