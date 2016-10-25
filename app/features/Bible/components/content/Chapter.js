import React, { Component, PropTypes } from 'react'

class Chapter extends Component {
	constructor(props) {
		super(props)
		this.state = { selection: {}, selectedClasses: {} }
	}

	handleClick(e) {
		const { onSelect } = this.props
		let { selection, selectedClasses } = this.state

		e.preventDefault()

		const selectedVerse = e.target.parentNode.getAttribute('data-usfm')
		let selectedClass = e.target.parentNode.getAttribute('class')

		try {
			selectedClass = selectedClass.split(' ')[1]
		} catch(e) {}

		if (typeof this.state.selection[selectedVerse] === 'undefined') {
			if (typeof selectedVerse !== 'undefined') {
				selection[selectedVerse] = true
			}
		} else {
			delete selection[selectedVerse]
		}

		if (typeof this.state.selectedClasses[selectedClass] === 'undefined') {
			if (typeof selectedClass !== 'undefined') {
				selectedClasses[selectedClass] = true
			}
		} else {
			delete selectedClasses[selectedClass]
		}

		console.log(selectedClass, selectedVerse, selection, getSelectionString(selection))

		this.setState({ selection })

		if (typeof onSelect == 'function') {
			onSelect()
		}
	}

	render() {
		let { chapter } = this.props

		if (typeof chapter !== 'object') {
			chapter = {}
		}

		const { content, copyright, next, previous, reference } = chapter

		const innerContent = { __html: content }

		return (<div onClick={::this.handleClick} dangerouslySetInnerHTML={innerContent} />)
	}
}

Chapter.propTypes = {
	chapter: React.PropTypes.object,
	onSelect: React.PropTypes.func,
	textDirection: React.PropTypes.string,
	fontSize: React.PropTypes.string,
	fontFamily: React.PropTypes.string,
	showFootnotes: React.PropTypes.bool,
	showVerseNumbers: React.PropTypes.bool,
	showTitles: React.PropTypes.bool
}

export default Chapter