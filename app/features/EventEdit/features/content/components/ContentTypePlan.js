import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'

var PlanList = React.createClass({

	render: function() {
		const { items, handlePlanClick } = this.props

		var createItem = function(item) {
			var image;
			if (item.images) {
				image = <img src={item.images[2].url} />;
			} else {
				image = <img src="http://placehold.it/80/80" />;
			}

			return <li key={item.id} data-id={item.id} name="id" value={item.id} onClick={handlePlanClick}>
				{image}
				{item.name.default}
				<i>{item.total_days + " days"}</i>
			</li>;
		};
		return <ul>{items.map(createItem)}</ul>;
	}
});

class ContentTypePlan extends Component {

	render() {
		const { contentIndex, contentData, handlePlanSearchChange, handlePlanAdd, handlePlanRemove, plans } = this.props
		var output;
		if (contentData.id) {
			var selectedPlan;
			selectedPlan = [{
				'id': contentData.id,
				'total_days': contentData.id,
				'name': {'default': contentData.language_tag}
			}]
			output = <div>
				<PlanList items={selectedPlan} handlePlanClick={handlePlanRemove} />
			</div>

		} else if (plans.focus_id == contentIndex) {
			output = <div>
				<FormField
					InputType={Input}
					placeholder="Search…"
					name="query"
					onChange={handlePlanSearchChange}
					value={plans.query}
					errors={contentData.errors} />

				<PlanList items={plans.items} handlePlanClick={handlePlanAdd} />
			</div>

		} else {
			output = <div>
				<FormField
					InputType={Input}
					placeholder="Search…"
					name="query"
					onChange={handlePlanSearchChange}
					value=''
					errors={contentData.errors} />
			</div>

		}
		return (
			<div>
				{output}
			</div>
		)
	}
}

ContentTypePlan.propTypes = {

}

export default ContentTypePlan
