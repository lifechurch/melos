import React, { Component } from 'react'

class PlanRef extends Component {
	render() {
		const { plan, refContent } = this.props

		console.log(refContent)
		if (!plan || !refContent) {
			return (
				<div></div>
			)
		}
		return (
			<div>
				<p>Plan Day Ref</p>
			</div>
		)
	}
}

PlanRef.propTypes = {

}

export default PlanRef
