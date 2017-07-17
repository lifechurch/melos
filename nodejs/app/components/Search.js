import React, { Component, PropTypes } from 'react'
import Input from './Input'
import SearchIcon from './Icons/SearchIcon'


class Search extends Component {
	constructor(props) {
		super(props)
		const { showInput, value, showIcon } = props
		this.state = {
			showIcon,
			showInput,
			value: value || '',
		}
	}

	handleSearch = () => {
		const { onHandleSearch } = this.props
		const { value } = this.state
		if (onHandleSearch && typeof onHandleSearch === 'function') {
			onHandleSearch(value)
		}
	}

	handleChange = (val) => {
		if (val) {
			this.setState({
				value: val,
			})
		}
	}

	handleKeyUp = (e) => {
		if (e.keyCode === 13) {
			this.handleSearch()
		}
	}

	handleClick = () => {
		const { showInput } = this.state
		// if the input is shown, we want to search
		// if not, we want to show the input
		if (showInput) {
			this.handleSearch()
		} else {
			this.showInput()
		}
	}

	showInput = () => {
		this.setState({
			showInput: true
		})
	}
	closeInput = () => {
		this.setState({
			showInput: false
		})
	}

	render() {
		const { placeholder, debounce, customClass } = this.props
		const { showInput, showIcon } = this.state

		return (
			<div className={`search ${showInput ? 'open' : ''} ${customClass}`}>
				{
					showInput &&
					<Input
						name='search'
						customClass='search-input'
						onChange={this.handleChange}
						onKeyUp={this.handleKeyUp}
						placeholder={placeholder}
						debounce={debounce}
						type='search'
					/>
				}
				{
					showIcon &&
					<a tabIndex={0} onClick={this.handleClick}>
						<SearchIcon
							fill='gray'
							width={15}
							height={30}
						/>
					</a>
				}
			</div>
		)
	}
}

Search.propTypes = {
	showInput: PropTypes.bool,
	showIcon: PropTypes.bool,
	placeholder: PropTypes.string,
	onHandleSearch: PropTypes.func,
	value: PropTypes.string,
	debounce: PropTypes.bool,
	customClass: PropTypes.string,
}

Search.defaultProps = {
	showInput: true,
	showIcon: true,
	placeholder: '',
	onHandleSearch: null,
	value: null,
	debounce: false,
	customClass: null,
}

export default Search
