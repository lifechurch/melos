import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import arrayToObject from '@youversion/utils/lib/arrayToObject'
import LabelsModal from './LabelsModal'
import LabelInput from './LabelInput'
import LabelList from './LabelList'
import Filter from '../../../../../../app/lib/filter'
import DropdownTransition from '../../../../../components/DropdownTransition'

class LabelSelector extends Component {

	constructor(props) {
		super(props)

		this.state = {
			inputValue: '',
			dropdown: false,
			filtering: false,
			inputDisabled: false,
			selectedLabels: {},
			addedLabels: {},
			filteredLabels: null,
			selected: 0
		}
	}

	componentDidMount() {
		const { byCount } = this.props
		// label list client side when the component renders
		Filter.build('LabelStore', [ 'label' ])
		Filter.add('LabelStore', byCount)
	}

	componentDidUpdate(prevProps, prevState) {
		const { updateLabels } = this.props
		const { dropdown, addedLabels, filteredLabels } = this.state

		// handle state change on dropdown open and close
		if (dropdown !== prevState.dropdown) {
			if (dropdown) {
				this.setState({
					inputDisabled: true,
					filteredLabels: null,
					inputValue: '',
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
				selectedLabels: addedLabels
			})
			// let the parent that is saving the bookmark know what labels to save
			if (typeof updateLabels === 'function') {
				updateLabels(addedLabels)
			}
		}
	}

	/**
	 * filters the labels based on inputValue
	 *
	 * @param      {string}  inputValue   	current value of the input field
	 */
	handleChange = (inputValue) => {
		// filter the labels given the input change
		const results = Filter.filter('LabelStore', inputValue.trim())
		this.setState({ inputValue })

		// reset when there are no characters in the input
		if (inputValue === '') {
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
	 * pressing Enter will add the current input value as a label
	 * this is how a user would add new labels
	 *
	 * @param      {object}  event         KeyDown event
	 * @param      {string}  keyEventName  Name of key event used for all except space bar
	 * @param      {number}  keyEventCode  Code value of key event
	 */
	handleKeyDown = (event, keyEventName) => {
		const {
			inputValue
		} = this.state

		if (keyEventName === 'Enter') {
			event.preventDefault()
			this.handleAddLabels(inputValue)
			this.setState({ inputValue: null })
		}
	}

	/**
	 * fired on clicking a selectable label
	 * note that the number of selected labels only changes if we're
	 * selecting or unselecting a new label (one that hasn't already been added)
	 *
	 * @param      {string}  label   	label being selected
	 */
	handleSelect = (label) => {
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
	handleAddLabels = (label) => {
		const { addedLabels, selectedLabels } = this.state
		// if we don't pass a label, then we're just adding all selected labels with
		// modal add button, then we just merge selected to added
		if (typeof label !== 'string') {
			this.setState({
				addedLabels: Immutable.fromJS(addedLabels).merge(selectedLabels).toJS(),
				dropdown: false
			})
		// else we're passing a label to add (from filtering enter or click of filtered label)
		} else {
			this.setState({ addedLabels: Immutable.fromJS(addedLabels).merge({ [label]: true }).toJS() })
		}
	}

	/**
	 * fired on clicking 'x' on label
	 * remove label from addedLabels state
	 *
	 * @param      {string}  label   	label to delete
	 */
	handleDelete = (label) => {
		const { addedLabels } = this.state

		this.setState({
			addedLabels: Immutable.fromJS(addedLabels).delete(label).toJS()
		})
	}

	/**
	 * called anytime the filteredLabels or the addedLabels change
	 *
	 * this removes any label from the filtered list that has been added
	 * to the bookmark
	 *
	 * @param  {filteredLabels}  array 		contains all the labels that have been
	 * 																		filtered by handleChange (input)
	 */
	cleanFilteredLabels = (filteredLabels) => {
		const { addedLabels } = this.state
		// convert the filtered labels to an object for accessing label
		const filtered = arrayToObject(filteredLabels, 'label')

		if (Object.keys(addedLabels).length > 0) {
			Object.keys(addedLabels).forEach((key) => {
				if (addedLabels[key] && `${key}` in filtered) {
					delete filtered[key]
				}
			})
		}
		// convert back to array for LabelLists
		return Object.keys(filtered).map(key => { return filtered[key] })
	}

	/**
	 * click handlers for opening and closing the modal
	 * attached to plus button and cancel button respectively
	 */
	handleClick = () => {
		this.setState({ dropdown: true })
	}

	handleCancelDropDown = () => {
		this.setState({ dropdown: false })
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
				<div className={'filtered-labels'}>
					<LabelList list={filteredLabels} onSelect={this.handleAddLabels} selectedLabels={selectedLabels} />
				</div>
			)
		}

		return (
			<div className='labels'>
				<div className='added-labels'>
					<LabelList list={Object.keys(addedLabels)} canDelete={true} onDelete={this.handleDelete} />
				</div>
				<LabelInput
					input={inputValue}
					disabled={inputDisabled}
					onDelete={this.handleDelete}
					onClick={this.handleClick}
					onChange={this.handleChange}
					onKeyDown={this.handleKeyDown}
					intl={intl}
				/>
				{ filteredlabels }
				<DropdownTransition show={dropdown} onOutsideClick={this.handleCancelDropDown}>
					<LabelsModal
						byAlphabetical={byAlphabetical}
						byCount={byCount}
						addLabels={this.handleAddLabels}
						onSelect={this.handleSelect}
						selectedLabels={selectedLabels}
						addedLabels={addedLabels}
						selected={selected}
						cancelDropDown={this.handleCancelDropDown}
					/>
				</DropdownTransition>
			</div>
		)
	}
}

LabelSelector.propTypes = {
	byAlphabetical: PropTypes.array,
	byCount: PropTypes.array,
	updateLabels: PropTypes.func,
	intl: PropTypes.any.isRequired
}

LabelSelector.defaultProps = {
	byAlphabetical: null,
	byCount: null,
	updateLabels: null
}

export default LabelSelector