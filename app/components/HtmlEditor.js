import React, { Component, PropTypes } from 'react'
import ReactQuill from 'react-quill'

const DEBOUNCE_TIMEOUT = 300

const formats = ['bold', 'italic']

const toolbarItems = [
	{
		label:'Text',
		type:'group',
		items: [
			{ type:'bold', label:'Bold' },
			{ type:'italic', label:'Italic' }
		]
	}
]

class HtmlEditor extends Component {
	constructor(props) {
		super(props)
		this.state = { value: props.value, isDirty: false }
	}

	componentWillReceiveProps(nextProps) {
		if (!this.state.isDirty) {
			this.setState({value: nextProps.value})
		}
	}

	sendUpdate() {
		const { onChange, name } = this.props
		const { value, isDirty } = this.state
		if (isDirty) {
			this.setState({isDirty: false})
			onChange({
				target: {
					value: value,
					name
				}
			})
		}
	}

	handleChange(value) {
		const { onChange } = this.props

		if (typeof this.cancelSave === 'number') {
			clearTimeout(this.cancelSave)
			this.cancelSave = null
		}

		this.setState({ value: value, isDirty: true })

		onChange({})
		this.cancelSave = setTimeout(::this.sendUpdate, DEBOUNCE_TIMEOUT)
	}

	render() {
		const { value } = this.state
		const html = {
			__html: value
		}

		return (
			<div className='content-html-editor'>
				<ReactQuill
					formats={formats}
					theme="snow"
					value={value}
					onChange={::this.handleChange}>

					<div
						key='toolbar'
						ref='toolbar'
						items={toolbarItems}>
						<a className='ql-bold'>Bold</a>
						<a className='ql-italic'>Italic</a>
					</div>

					<div
						key='editor'
						ref='editor'
						className='quill-contents form-body-block white content-html-editor-content'
						dangerouslySetInnerHTML={html} />

				</ReactQuill>
			</div>
		)
	}
}

HtmlEditor.propTypes = {
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
}

export default HtmlEditor