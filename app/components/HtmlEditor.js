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
	sendUpdate() {
		const { onChange, name, value } = this.props
		if (value !== this.newValue) {
			onChange({
				target: {
					value: this.newValue,
					name
				}
			})	
		}
	}

	handleChange(newValue) {
		const { onChange} = this.props
		if (typeof this.cancelSave === 'number') {
			clearTimeout(this.cancelSave)
			this.cancelSave = null
		}

		this.newValue = newValue;
		onChange({}) 
		this.cancelSave = setTimeout(::this.sendUpdate, DEBOUNCE_TIMEOUT)
	}

	render() {
		const { value } = this.props
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