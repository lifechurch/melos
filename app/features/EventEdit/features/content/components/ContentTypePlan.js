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

			return <li key={item.id} data-plan_id={item.id} name="plan_id" value={item.id} onClick={handlePlanClick}>
				{image}
				<div className="title">{item.name.default}</div>
				<div className="length">{item.total_days + " days"}</div>
			</li>;
		};
		return <ul>{items.map(createItem)}</ul>;
	}
});

var SelectedPlan = React.createClass({

	render: function() {
		const { item, handlePlanClick } = this.props

		var image;
		if (item.images) {
			image = <img src={item.images[2].url} />;
		} else {
			image = <img src="http://placehold.it/80/80" />;
		}

		return <div className="selected" key={item.plan_id} data-plan_id={item.plan_id} name="plan_id" value={item.plan_id} onClick={handlePlanClick}>
			{image}
			<div className="title">{item.name.default} <span className="remove">remove</span></div>
			<div className="length">{item.total_days + " days"}</div>
		</div>;
	}
});

class ContentTypePlan extends Component {

	render() {
		const { contentIndex, contentData, handlePlanSearchChange, handlePlanSearchFocus, handlePlanAdd, handlePlanRemove, plans } = this.props
		var output;

		// Selected
		if (contentData.plan_id) {
			var selectedPlan;
			selectedPlan = {
				'plan_id': contentData.plan_id,
				'total_days': contentData.plan_id,
				'name': {'default': contentData.language_tag}
			}
			output = <div>
				<SelectedPlan item={selectedPlan} handlePlanClick={handlePlanRemove} />
			</div>

		// Focused plan search
		} else if (plans.focus_id == contentIndex) {
			output = <div className="plan-content">
				<FormField
					InputType={Input}
					placeholder="Search…"
					name="query"
					onChange={handlePlanSearchChange}
					onFocus={handlePlanSearchFocus}
					value={plans.query}
					errors={contentData.errors} />

				<PlanList items={plans.items} handlePlanClick={handlePlanAdd} />
			</div>

		// Out-of-focus plan search
		} else {
			output = <div className="plan-content">
				<FormField
					InputType={Input}
					placeholder="Search…"
					name="query"
					onChange={handlePlanSearchChange}
					onFocus={handlePlanSearchFocus}
					value=''
					errors={contentData.errors} />
			</div>

		}
		return (
			<div className="plan-content">
				{output}
			</div>
		)
	}
}

ContentTypePlan.propTypes = {

}

export default ContentTypePlan
