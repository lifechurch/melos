import React, { Component, PropTypes } from 'react'
import LabelsModal from './LabelsModal'
import LabelInput from './LabelInput'
import LabelList from './LabelList'
import Filter from '../../../../../../app/lib/Filter'

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
		const { filtering, dropdown } = this.state

		// handle state change on dropdown open and close
		if (dropdown !== prevState.dropdown) {
			// if we're not filtering, disable the input
			if (dropdown && !filtering) {
				this.setState({ inputDisabled: true })
			} else {
				this.setState({ inputDisabled: false })
			}

		}
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

		if (results.length > 0) {
			this.setState({
				labels: results,
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
			labels
		} = this.state


		if (keyEventName == "Enter") {
			event.preventDefault()

		}


	}

	// onSelect is used for the labels inside the modal list
	onSelect(label) {
		const { selectedLabels, selected } = this.state

		if (`${label}` in selectedLabels) {
			// if the toggled label is now true
			if (!selectedLabels[label]) {
				this.setState({ selected: selected + 1 })
			} else {
				this.setState({ selected: selected - 1 })
			}
			this.setState({ selectedLabels: Object.assign(selectedLabels, { [label]: !selectedLabels[label] }) })
		} else {
			this.setState({
				selectedLabels: Object.assign(selectedLabels, { [label]: true }),
				selected: selected + 1
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
			this.setState({ addedLabels: Object.assign(addedLabels, selectedLabels) })
		// else we're passing a label to add (from filtering enter or click)
		} else {
			this.setState({ addedLabels: Object.assign(addedLabels, { [label]: true }) })
		}
	}

	// delete a label that has already been added
	onDelete(label) {
		const { addedLabels } = this.state

		this.setState({ addedLabels: Object.assign(addedLabels, { [label]: false }) })
	}


	render() {
		const { byAlphabetical, byCount } = this.props
		const {
			inputValue,
			inputDisabled,
			dropdown,
			filtering,
			labels,
			selectedLabels,
			selected,
			addedLabels
		} = this.state

		let filteredLabels = null
		let filterClass = 'hide-filter'
		if (filtering) {
			filterClass = 'show-filter'
			filteredLabels = <LabelList list={labels} onSelect={this.addLabels} selectedLabels={selectedLabels} />
		}

		let hide = dropdown ? '' : 'hide-modal'

		console.log(selectedLabels)
		console.log(addedLabels)

		return (
			<div className='labels'>
				<LabelInput
					input={inputValue}
					disabled={inputDisabled}
					addedLabels={addedLabels}
					onDelete={this.onDelete}
					onClick={this.handleClick}
					onChange={this.handleChange}
					onKeyDown={this.handleKeyDown}
				/>
				<div className={`filtered-labels ${filterClass}`}>
					{ filteredLabels }
				</div>
				<div className={`modal ${hide}`}>
					<LabelsModal
						byAlphabetical={byAlphabetical}
						byCount={byCount}
						addLabels={this.addLabels}
						onSelect={this.onSelect}
						selectedLabels={selectedLabels}
						selected={selected}
						cancelDropDown={this.cancelDropDown}
					/>
				</div>
			</div>
		)
	}
}

LabelSelector.propTypes = {

}

export default LabelSelector