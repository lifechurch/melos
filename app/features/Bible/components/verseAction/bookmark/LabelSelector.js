import React, { Component, PropTypes } from 'react'
import { injectIntl } from 'react-intl'
import LabelsModal from './LabelsModal'
import LabelInput from './LabelInput'
import LabelList from './LabelList'
import Filter from '../../../../../../app/lib/Filter'
import arrayToObject from '../../../../../../app/lib/arrayToObject'
import Immutable from 'immutable'

class LabelSelector extends Component {

	constructor(props) {
		super(props)

		this.state = {
			inputValue: null,
			dropdown: false,
			filtering: false,
			inputDisabled: false,
			selectedLabels: {},
			addedLabels: {},
			filteredLabels: null,
			selected: 0
		}

		this.handleClick = ::this.handleClick
		this.handleChange = ::this.handleChange
		this.onSelect = ::this.onSelect
		this.handleKeyDown = ::this.handleKeyDown
		this.cancelDropDown = ::this.cancelDropDown
		this.onDelete = ::this.onDelete
		this.addLabels = ::this.addLabels

	}

	componentDidMount() {
		const { byCount } = this.props
		// label list client side when the component renders
		Filter.build("LabelStore", [ "label" ])
		Filter.add("LabelStore", byCount)
	}

	componentDidUpdate(prevProps, prevState) {
		const { filtering, dropdown, addedLabels, filteredLabels } = this.state

		// handle state change on dropdown open and close
		if (dropdown !== prevState.dropdown) {
			if (dropdown) {
				this.setState({
					inputDisabled: true,
					filteredLabels: null,
					inputValue: null,
					selected: 0,
					filtering: false
				})
			} else {
				this.setState({ inputDisabled: false })
			}
		}

		// anytime we add labels, let's make sure we remove
		// the label from the filtered labels
		if (addedLabels !== prevState.addedLabels) {
			this.setState({
				filteredLabels: this.cleanFilteredLabels(filteredLabels),
				selectedLabels: addedLabels,
			})
		}
	}

	// remove all labels that have already been added to the bookmark
	// from the filtered list
	cleanFilteredLabels(filteredLabels) {
		const { addedLabels } = this.state
		// convert the filtered labels to an object for accessing label
		let filtered = arrayToObject(filteredLabels, 'label')

		if (Object.keys(addedLabels).length > 0) {
			Object.keys(addedLabels).forEach((key) => {
				if (addedLabels[key] && `${key}` in filtered) {
					delete filtered[key]
				}
			})
		}
		// convert back to array for LabelLists
		return Object.keys(filtered).map(key => filtered[key])
	}

	handleClick() {
		this.setState({
			dropdown: true,

		})
	}

	cancelDropDown() {
		this.setState({ dropdown: false })
	}

	handleChange(inputValue) {
		// filter the labels given the input change
		let results = Filter.filter("LabelStore", inputValue.trim())
		this.setState({ inputValue: inputValue })

		if (inputValue == '') {
			this.setState({
				filteredLabels: null,
				filtering: false
			})
		} else if (results.length > 0) {
			this.setState({
				filteredLabels: this.cleanFilteredLabels(results),
				dropdown: false,
				filtering: true
			})
		}
	}

	/**
	 * this handles pressing certain keys
	 *
	 * @param      {object}  event         KeyDown event
	 * @param      {string}  keyEventName  Name of key event used for all except space bar
	 * @param      {number}  keyEventCode  Code value of key event
	 */
	handleKeyDown(event, keyEventName, keyEventCode) {
		const {
			inputValue,
			filteredLabels
		} = this.state

		if (keyEventName == "Enter") {
			event.preventDefault()
			this.addLabels(inputValue)
		}

	}

	// onSelect is used for the labels inside the modal list
	onSelect(label) {
		const { selectedLabels, addedLabels, selected } = this.state

		// unselecting
		if (`${label}` in selectedLabels) {
			this.setState({
				selectedLabels: Immutable.fromJS(selectedLabels).delete(label).toJS(),
				selected: (selected > 0 && !(`${label}` in addedLabels)) ? selected - 1 : selected
			})
		// selecting
		} else {
			this.setState({
				selectedLabels: Immutable.fromJS(selectedLabels).merge({ [label]: true }).toJS(),
				selected: !(`${label}` in addedLabels) ? selected + 1 : selected
			})
		}
	}

	/**
	 * add labels to bookmark, either from filtering enter or click, or
	 * add button on modal
	 *
	 * @param      {string}  label   	label to add to the bookmark
	 * 																if no label is passed, then we're adding
	 * 																all selected labels
	 */
	addLabels(label) {
		const { addedLabels, selectedLabels } = this.state
		// if we don't pass a label, then we're just adding all selected labels with
		// modal add button, then we just merge selected to added
		if (typeof label != 'string') {
			this.setState({
				addedLabels: Immutable.fromJS(addedLabels).merge(selectedLabels).toJS(),
				dropdown: false
			})
		// else we're passing a label to add (from filtering enter or click)
		} else {
			this.setState({ addedLabels: Immutable.fromJS(addedLabels).merge({ [label]: true }).toJS() })
		}
	}


	// delete a label that has already been added
	onDelete(label) {
		const { addedLabels, filteredLabels } = this.state

		this.setState({
			addedLabels: Immutable.fromJS(addedLabels).delete(label).toJS()
		})
	}


	render() {
		const { byAlphabetical, byCount, intl } = this.props
		const {
			inputValue,
			inputDisabled,
			dropdown,
			filtering,
			filteredLabels,
			selectedLabels,
			selected,
			addedLabels
		} = this.state

		let filteredlabels = null
		if (filtering) {
			filteredlabels = (
				<div className={`filtered-labels`}>
					<LabelList list={filteredLabels} onSelect={this.addLabels} selectedLabels={selectedLabels} />
				</div>
			)
		}

		let hide = dropdown ? '' : 'hide-modal'

		return (
			<div className='labels'>
				<div className='added-labels'>
					<LabelList list={Object.keys(addedLabels)} canDelete={true} onDelete={this.onDelete} />
				</div>
				<LabelInput
					input={inputValue}
					disabled={inputDisabled}
					onDelete={this.onDelete}
					onClick={this.handleClick}
					onChange={this.handleChange}
					onKeyDown={this.handleKeyDown}
					intl={intl}
				/>
				{ filteredlabels }
				<div className={`modal ${hide}`}>
					<LabelsModal
						byAlphabetical={byAlphabetical}
						byCount={byCount}
						addLabels={this.addLabels}
						onSelect={this.onSelect}
						selectedLabels={selectedLabels}
						addedLabels={addedLabels}
						selected={selected}
						cancelDropDown={this.cancelDropDown}
					/>
				</div>
			</div>
		)
	}
}

LabelSelector.propTypes = {
	byAlphabetical: React.PropTypes.array,
	byCount: React.PropTypes.array,
}

export default injectIntl(LabelSelector)