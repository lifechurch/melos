import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'
import ActionCreators from '../actions/creators'

const SEARCH_TIMEOUT = 500

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
				<div className="length">{item.formatted_length.default}</div>
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
			<div className="title">{item.title}</div>
			<div className="length">{item.formatted_length}</div>
		</div>;
	}
});

class ContentTypePlan extends Component {

	performPlanSearch(index, field, value) {
		const { dispatch } = this.props
		dispatch(ActionCreators.searchPlans({
			index,
			query: value,
			language_tag: 'en'
		}))
	}

	clearPlanSearch() {
		const { dispatch } = this.props
		dispatch(ActionCreators.clearPlanSearch())
	}

	handlePlanSearchChange(changeEvent) {
		const { contentIndex, handlePlanSearchChange, dispatch } = this.props
		const { name, field, value } = changeEvent.target

		dispatch(ActionCreators.setPlanField({
			index: contentIndex,
			field,
			value
		}))

		if (typeof this.cancelSearch === 'number') {
			clearTimeout(this.cancelSearch)
			this.cancelSearch = null
		}

		// Can't pass extra params in IE?
		this.cancelSearch = setTimeout(::this.performPlanSearch, SEARCH_TIMEOUT, contentIndex, field, value)

	}

	handlePlanSearchFocus(focusEvent) {
		const { contentIndex, dispatch } = this.props

		dispatch(ActionCreators.focusPlanSearch({
			index: contentIndex
		}))
	}

	handlePlanAdd(clickEvent) {
		const { contentIndex, dispatch, handleChange, plans } = this.props
		const plan_id = parseInt(clickEvent.currentTarget.dataset['plan_id'])

		// Find in plans[]
		// If we knew the index, we could just pass it directly
		var selectedPlan;
		selectedPlan = 0
		for( var i in plans.items ){
			if( plans.items[i].id == plan_id ) {
				selectedPlan = plans.items[i];
				break;
			}
		}

		dispatch(ActionCreators.selectPlan({
			index: contentIndex,
			selectedPlan: {
				plan_id: selectedPlan.id,
				title: selectedPlan.name.default,
				formatted_length: selectedPlan.formatted_length.default,
				images: selectedPlan.images,
				short_url: selectedPlan.short_url
			}
		}))

		handleChange({target: {name: 'plan_id', value: plan_id}})
	}

	handlePlanRemove(clickEvent) {
		const { contentIndex, handleChange, autoSave } = this.props
		handleChange({target: {name: 'plan_id', value: 0}})
	}

	render() {
		const { contentIndex, contentData, plans } = this.props
		var output;

		// Selected
		if (contentData.plan_id) {
			output = <div>
				<SelectedPlan item={contentData} handlePlanClick={::this.handlePlanRemove} />
			</div>

		// Focused plan search
		} else if (plans.focus_id == contentIndex) {
			output = <div className="plan-content">
				<FormField
					InputType={Input}
					placeholder="Search…"
					name="query"
					onChange={::this.handlePlanSearchChange}
					onFocus={::this.handlePlanSearchFocus}
					value={plans.query}
					errors={contentData.errors} />

				<PlanList items={plans.items} handlePlanClick={::this.handlePlanAdd} />
			</div>

		// Out-of-focus plan search
		} else {
			output = <div className="plan-content">
				<FormField
					InputType={Input}
					placeholder="Search…"
					name="query"
					onChange={::this.handlePlanSearchChange}
					onFocus={::this.handlePlanSearchFocus}
					value=''
					errors={contentData.errors} />
			</div>

		}

		return (
			<div>
				<div className="form-body-block white plan-content">
					{output}
				</div>
			</div>
		)
	}
}

ContentTypePlan.propTypes = {

}

export default ContentTypePlan
