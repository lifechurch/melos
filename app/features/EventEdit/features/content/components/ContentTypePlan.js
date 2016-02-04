import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'

var PlanList = React.createClass({
	render: function() {
		var createItem = function(item) {
			return <li key={item.id}>
				<img src={item.images[2].url} />
				{item.name.default}
				<i>{item.total_days} days</i>
			</li>;
		};
		return <ul>{this.props.items.map(createItem)}</ul>;
	}
});

class ContentTypePlan extends Component {

	render() {
		const { contentData, handleChange, plans } = this.props
		return (
			<div>
				<FormField
					InputType={Input}
					placeholder="Search…"
					name="query"
					onChange={handleChange}
					value={plans.query}
					errors={contentData.errors} />

				<PlanList items={plans.items} />
			</div>
		)
	}
}

ContentTypePlan.propTypes = {

}

export default ContentTypePlan
