import React, { Component, PropTypes } from 'react'
import Input from './Input'
import SearchIcon from './Icons/SearchIcon'
import XMark from './XMark'


class Search extends Component {
	constructor(props) {
		super(props)
		const { showInput, value } = props
		this.state = {
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
		const { onChange } = this.props
		this.setState({
			value: val,
		})
		if (onChange) {
			onChange(val)
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
		const { showIcon, showClear, placeholder, debounce, customClass } = this.props
		const { showInput, value } = this.state

		return (
			<div className={`search vertical-center ${showInput ? 'open' : ''} ${customClass}`}>
				{
					showInput &&
					<Input
						ref={(i) => { this.input = i }}
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
				{
					showClear
						&& value
						&& value.length > 0
						&& (
							<a
								tabIndex={0}
								onClick={() => {
									this.input.clearInput()
									this.setState({ value: '' })
								}}
								style={{ position: 'absolute' }}
							>
								<XMark
									fill='gray'
									width={11}
									height={11}
								/>
							</a>
						)
				}
			</div>
		)
	}
}

Search.propTypes = {
	showInput: PropTypes.bool,
	showIcon: PropTypes.bool,
	showClear: PropTypes.bool,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	onHandleSearch: PropTypes.func,
	value: PropTypes.string,
	debounce: PropTypes.bool,
	customClass: PropTypes.string,
}

Search.defaultProps = {
	showInput: true,
	showIcon: true,
	showClear: true,
	placeholder: '',
	onHandleSearch: null,
	value: null,
	debounce: false,
	customClass: null,
	onChange: null,
}

export default Search
