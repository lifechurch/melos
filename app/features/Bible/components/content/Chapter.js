import React, { Component, PropTypes } from 'react'
import { getSelectionString, getSelectionText } from '../../../../lib/usfmUtils'
import ChapterCopyright from './ChapterCopyright'

const DEFAULT_STATE = { selection: null, selectedClasses: null, selectedText: null }

class Chapter extends Component {
	constructor(props) {
		super(props)
		this.state = Object.assign({}, DEFAULT_STATE)
		this.clearSelection = ::this.clearSelection
	}

	clearSelection() {
		this.setState(Object.assign({}, DEFAULT_STATE))
	}

	handleVerseClick(verseNode) {
		const { onSelect } = this.props
		let { selection, selectedClasses, selectedText } = this.state

		if (selection === null) {
			selection = {}
		}

		if (selectedClasses === null) {
			selectedClasses = {}
		}

		if (selectedText === null) {
			selectedText = {}
		}

		// Build CSS Selector for Verse Selection
		if (typeof verseNode.getAttribute('class') === 'string') {
			let selectedClassString = verseNode.getAttribute('class')
			let newClasses = selectedClassString.split(' ')
			let remIndex = newClasses.indexOf('verse')
			if (remIndex > -1) {
				newClasses.splice(remIndex, 1)
			}
			newClasses.forEach((newClass) => {
				const newClassString = `.bible-reader .${newClass}`
				if (typeof selectedClasses[newClassString] === 'undefined') {
					const isVerseSelector = new RegExp("^v[0-9]+$")
					if (typeof newClassString !== 'undefined' && isVerseSelector.test(newClass)) {
						selectedClasses[newClassString] = true
					}
				} else {
					delete selectedClasses[newClassString]
				}
			})
		}

		// Build Selected Verses Array of USFMs
		if (typeof verseNode.getAttribute('data-usfm') === 'string') {
			const selectedVerses = verseNode.getAttribute('data-usfm').split("+")
			let lastUsfm

			selectedVerses.forEach((selectedVerse) => {
				if (typeof selection[selectedVerse] === 'undefined') {
					const isUSFM = new RegExp("^[0-9A-Za-z]{3}\.[0-9]+\.[0-9]+$")
					if (typeof selectedVerse !== 'undefined' && isUSFM.test(selectedVerse)) {
						selection[selectedVerse] = true
					}
				} else {
					delete selection[selectedVerse]
				}
				selectedText[selectedVerse] = true
				lastUsfm = selectedVerse
			})

			// Get selected text
			Array.prototype.forEach.call(verseNode.childNodes, (cNode) => {
				if (cNode.getAttribute('class') === 'content') {
					selectedText[lastUsfm] = cNode.innerText
				}
			})
			this.setState({ selectedText, selection, selectedClasses })
		}

		if (typeof onSelect === 'function') {
			onSelect({
				verses: Object.keys(selection),
				human: getSelectionString(selection),
				text: getSelectionString(selectedText, true)
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
		let { selectedClasses } = this.state
		let { chapter, fontSize, fontFamily, textDirection, showFootnotes, showVerseNumbers, verseColors } = this.props

		if (typeof chapter !== 'object') {
			chapter = {}
		}

		if (selectedClasses === null) {
			selectedClasses = {}
		}

		const { content, copyright, next, previous, reference } = chapter

		const innerContent = { __html: content }

		const style = {
			fontSize,
			fontFamily
		}

		let highlightedStyles = ""
		if (Array.isArray(verseColors) && verseColors.length > 0) {
			let selectors = []
			verseColors.forEach((verseColor) => {
				const [ usfm, color ] = verseColor
				if (typeof usfm === 'string' && typeof color === 'string') {
					highlightedStyles += ` .v${usfm.split('.')[2]} { background-color: #${color}; } `
				}
			})
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

		const innerStyle = { __html: [selectedStyles, footnoteStyles, verseNumberStyles, highlightedStyles].join(' ') }

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

				<ChapterCopyright copyright={chapter.copyright} versionId={chapter.reference.version_id} />

			</div>
		)
	}
}

Chapter.propTypes = {
	chapter: React.PropTypes.object,
	onSelect: React.PropTypes.func,
	textDirection: React.PropTypes.string,
	fontSize: React.PropTypes.number,
	fontFamily: React.PropTypes.string,
	showFootnotes: React.PropTypes.bool,
	showVerseNumbers: React.PropTypes.bool,
	verseColors: React.PropTypes.array
}

export default Chapter