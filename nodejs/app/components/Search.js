import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from './Input'
import SearchIcon from './icons/SearchIcon'
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

	componentWillReceiveProps(nextProps) {
		const { showInput } = this.props
		const { showInput: nextShowInput } = nextProps

		if (showInput !== nextShowInput) {
			this.setState({ showInput: nextShowInput })
		}
	}

	handleSearch = () => {
		const { onHandleSearch } = this.props
		const { value } = this.state
		if (onHandleSearch && typeof onHandleSearch === 'function') {
			onHandleSearch(value)
		}
	}

	handleChange = (changeEvent) => {
		const { value } = changeEvent.target
		const { onChange } = this.props
		this.setState({ value })
		if (typeof onChange === 'function') {
			onChange(value)
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
		const { showIcon, showClear, showClose, placeholder, debounce, customClass } = this.props
		const { showInput, value } = this.state

		return (
			<div className={`search vertical-center ${showInput ? 'open' : ''} ${customClass}`}>
				{
					showIcon &&
					<a tabIndex={0} onClick={this.handleClick}>
						<SearchIcon
							fill='gray'
							className='searchicon-container'
						/>
					</a>
				}
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
								className='close-button'
							>
								<XMark
									fill='gray'
									width={14}
									height={14}
								/>
							</a>
						)
				}
				{
					showClose
					&& showInput
					&& (
						<a
							tabIndex={0}
							onClick={this.closeInput}
							style={{ margin: '0 10px' }}
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
	showClose: PropTypes.bool,
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
	showClose: false,
	placeholder: '',
	onHandleSearch: null,
	value: '',
	debounce: false,
	customClass: null,
	onChange: null,
}

export default Search
