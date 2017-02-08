import React, { Component, PropTypes } from 'react'
import { getSelectionString, getSelectionText } from '../../../../lib/usfmUtils'

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
		let { selection, selectedClasses } = this.state

		if (selection === null) {
			selection = {}
		}

		if (selectedClasses === null) {
			selectedClasses = {}
		}

		// Build CSS Selector for Verse Selection
		if (typeof verseNode.getAttribute('class') === 'string') {
			const selectedClassString = verseNode.getAttribute('class')
			const newClasses = selectedClassString.split(' ')
			const remIndex = newClasses.indexOf('verse')
			if (remIndex > -1) {
				newClasses.splice(remIndex, 1)
			}
			newClasses.forEach((newClass) => {
				const newClassString = `.bible-reader .${newClass}`
				if (typeof selectedClasses[newClassString] === 'undefined') {
					const isVerseSelector = new RegExp('^v[0-9]+$')
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
			const selectedVerses = verseNode.getAttribute('data-usfm').split('+')
			let lastUsfm

			selectedVerses.forEach((selectedVerse) => {
				if (typeof selection[selectedVerse] === 'undefined') {
					const isUSFM = new RegExp('^[0-9A-Za-z]{3}\.[0-9]+\.[0-9]+$')
					if (typeof selectedVerse !== 'undefined' && isUSFM.test(selectedVerse)) {
						selection[selectedVerse] = true
					}
				} else {
					delete selection[selectedVerse]
				}
				lastUsfm = selectedVerse
			})
			this.setState({ selection, selectedClasses })
		}

		if (typeof onSelect === 'function') {
			onSelect({
				verses: Object.keys(selection),
				human: getSelectionString(selection),
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
		const {
			content,
			fontSize,
			fontFamily,
			textDirection,
			showFootnotes,
			showVerseNumbers,
			verseColors
		} = this.props


		if (selectedClasses === null) {
			selectedClasses = {}
		}

		const innerContent = { __html: content }

		const style = {
			fontSize,
			fontFamily
		}

		let highlightedStyles = ''
		if (Array.isArray(verseColors) && verseColors.length > 0) {
			const selectors = []
			verseColors.forEach((verseColor) => {
				const [ usfm, color ] = verseColor
				if (typeof usfm === 'string' && typeof color === 'string') {
					highlightedStyles += ` .v${usfm.split('.')[2]} { background-color: #${color}; } `
				}
			})
		}


		let selectedStyles = ''
		if (Object.keys(selectedClasses).length > 0) {
			selectedStyles = `${Object.keys(selectedClasses).join(',')} { border-bottom: dotted 1px #777; }`
		}


		let footnoteStyles = ''
		if (showFootnotes) {
			footnoteStyles = ".bible-reader .note::before { display: inline-block; width: 12px; height: 12px; content: ''; background-image: url(/assets/footnote.png); background-size: contain; background-repeat: no-repeat; background-size: 12px; margin: 5px; cursor: pointer; cursor: context-menu; }"
		} else {
			footnoteStyles = '.bible-reader .note { display: none !important }'
		}

		const verseNumberStyles = `.bible-reader .label { display: ${showVerseNumbers ? 'inherit' : 'none'} }`

		const innerStyle = { __html: [selectedStyles, footnoteStyles, verseNumberStyles, highlightedStyles].join(' ') }

		return (
			<div
				className="bible-reader"
				dir={textDirection}
			>

				<style dangerouslySetInnerHTML={innerStyle} />

				<div
					className="reader"
					onClick={::this.handleClick}
					dangerouslySetInnerHTML={innerContent}
					style={style}
				/>
			</div>
		)
	}
}

Chapter.propTypes = {
	content: PropTypes.string,
	onSelect: PropTypes.func,
	textDirection: PropTypes.string,
	fontSize: PropTypes.number,
	fontFamily: PropTypes.string,
	showFootnotes: PropTypes.bool,
	showVerseNumbers: PropTypes.bool,
	verseColors: PropTypes.array
}

export default Chapter
