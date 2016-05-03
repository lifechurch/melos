import React, { Component, PropTypes } from 'react'
import ReactQuill from 'react-quill'
import { injectIntl, FormattedMessage } from 'react-intl'

const DEBOUNCE_TIMEOUT = 300

const formats = ['bold', 'italic']

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
		const { intl } = this.props
		const html = {
			__html: value
		}

		const toolbarItems = [
			{
				label:intl.formatMessage({ id: "components.HtmlEditor.text" }),
				type:'group',
				items: [
					{ type:'bold', label: intl.formatMessage({ id: "components.HtmlEditor.bold" }) },
					{ type:'italic', label: intl.formatMessage({ id: "components.HtmlEditor.italic" }) }
				]
			}
		]


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
						<a className='ql-bold'><FormattedMessage id="components.HtmlEditor.bold" /></a>
						<a className='ql-italic'><FormattedMessage id="components.HtmlEditor.italic" /></a>
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

export default injectIntl(HtmlEditor)