import React, { Component, PropTypes } from 'react'
import { getSelectionString } from '../../../../lib/usfmUtils'
import ChapterCopyright from './ChapterCopyright'

class Chapter extends Component {
	constructor(props) {
		super(props)
		this.state = { selection: {}, selectedClasses: {} }
	}

	handleVerseClick(verseNode) {
		const { onSelect } = this.props
		let { selection, selectedClasses } = this.state

		const selectedVerse = verseNode.getAttribute('data-usfm')
		let selectedClass = verseNode.getAttribute('class')

		try {
			selectedClass = `.bible-reader .${selectedClass.split(' ')[1]}`
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

		this.setState({ selection })

		if (typeof onSelect == 'function') {
			onSelect({
				verses: Object.keys(selection),
				human: getSelectionString(selection)
			})
		}
	}

	handleFootnoteClick(footnoteNode) {
		footnoteNode.classList.toggle('show')
	}

	handleClick(e) {
		e.preventDefault()

		let node = e.target
		while (typeof node !== 'undefined' && typeof node.classList !== 'undefined' && !node.classList.contains('verse') && !node.classList.contains('note')) {
			node = node.parentNode
		}

		if (typeof node !== 'undefined' && typeof node.classList !== 'undefined') {
			if (node.classList.contains('verse')) {
				::this.handleVerseClick(node)
			} else if (node.classList.contains('note')) {
				::this.handleFootnoteClick(node)
			}
		}
	}

	render() {
		const { selectedClasses } = this.state
		let { chapter, fontSize, fontFamily, textDirection, showFootnotes, showVerseNumbers, showTitles } = this.props

		if (typeof chapter !== 'object') {
			chapter = {}
		}

		const { content, copyright, next, previous, reference } = chapter

		const innerContent = { __html: content }

		const style = {
			fontSize,
			fontFamily
		}


		let selectedStyles = ""
		if (Object.keys(selectedClasses).length > 0) {
			selectedStyles = `${Object.keys(selectedClasses).join(',')} { border-bottom: dotted 1px #777; }`
		}


		let footnoteStyles = ""
		if (showFootnotes) {
			footnoteStyles = ".bible-reader .note::before { display: inline-block; width: 12px; height: 12px; content: ''; background-image: url(/assets/footnote.png); background-size: contain; background-repeat: no-repeat; background-size: 12px; margin: 5px; cursor: pointer; cursor: context-menu; }"
		} else {
			footnoteStyles = ".bible-reader .note { display: none !important }"
		}

		let verseNumberStyles = `.bible-reader .label { display: ${showVerseNumbers ? 'inherit' : 'none'} }`

		const innerStyle = { __html: [selectedStyles, footnoteStyles, verseNumberStyles].join(' ') }

		return (
			<div
				className="bible-reader"
				dir={textDirection} >

				<style dangerouslySetInnerHTML={innerStyle} />

				<div
					className="reader"
					onClick={::this.handleClick}
					dangerouslySetInnerHTML={innerContent}
					style={style}
				/>

				<ChapterCopyright copyright={chapter.copyright} />

			</div>
		)
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