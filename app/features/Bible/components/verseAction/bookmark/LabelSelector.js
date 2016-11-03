import React, { Component, PropTypes } from 'react'
import LabelsModal from './LabelsModal'
import LabelInput from './LabelInput'

class LabelSelector extends Component {

	constuctor(props) {
		super(props)

		this.state = {
			inputValue: null,
			dropdown: false,
			filtering: false,
			disabled: false,
			selectedLabels: {},
			selected: 0
		}

		this.handleClick = this.handleClick.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleSelect =
	}

	componentDidMount() {
		const { byCount } = this.props
		// label list client side when the component renders
		Filter.build("LabelStore", [ "label" ])
		Filter.add("LabelStore", byCount)
	}

	handleClick() {

		this.setState({
			dropdown: true,

		})
	}

	cancelDropDown() {

	}

	handleChange(inputValue) {
		// filter the labels given the input change
		let results = Filter.filter("LabelStore", inputValue.trim())
		this.setState({ inputValue: inputValue })

		if (results.length > 0) {
			this.setState({
				labels: results
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

	onSelect(label) {
		const { selectedLabels, selected } = this.state

		if (`${label}` in selectedLabels) {
			// if the toggled label is now true
			if (!selectedLabels[label]) {
				this.setState({ selected: selected + 1 })
			} else {
				this.setState({ selected: selected - 1 })
			}
			this.setState({ selectedLabels: Object.assign(selectedLabels, { [label]: !selectedLabels[label]}) })
		} else {
			this.setState({
				selectedLabels: Object.assign(selectedLabels, { [label]: true }),
				selected: selected + 1
			})
		}
	}


	render() {
		const { inputValue, disabled, dropdown, filtering } = this.state

		let filteredLabels = null
		if (filtering) {
			filteredLabels = <LabelList />
		}

		return (
			<div>
				<LabelInput input={inputValue} disabled={disabled} onClick={this.handleClick} />
				<div className='filtered-labels'>
					{  }
				</div>
				<LabelsModal byAlphabetical={bible.momentsLabels.byAlphabetical} byCount={bible.momentsLabels.byCount} onSelect={this.onSelect} />
			</div>
		)
	}
}

LabelSelector.propTypes = {

}

export default LabelSelector