import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	USER_READER_SETTINGS,
} from '../../../../lib/readerUtils'


const DEFAULT_STATE = { selection: null, selectedClasses: null, selectedText: null }

function handleFootnoteClick(footnoteNode) {
	footnoteNode.classList.toggle('show')
}

class Chapter extends Component {
	constructor(props) {
		super(props)
		this.state = Object.assign({}, DEFAULT_STATE)
	}

	componentWillReceiveProps(nextProps) {
		const { content: nextContent } = nextProps
		const { content } = this.props
		if (nextContent !== content) {
			this.clearSelection()
		}
	}

	clearSelection() {
		this.setState(Object.assign({}, DEFAULT_STATE))
	}

	handleVerseClick = (verseNode) => {
		const { onSelect, className } = this.props
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
				const newClassString = `.bible-reader.${className} .${newClass}`
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
			selectedVerses.forEach((selectedVerse) => {
				if (typeof selection[selectedVerse] === 'undefined') {
					const isUSFM = new RegExp('^[0-9A-Za-z]{3}\.[0-9]+\.[0-9]+$')
					if (typeof selectedVerse !== 'undefined' && isUSFM.test(selectedVerse)) {
						selection[selectedVerse] = true
					}
				} else {
					delete selection[selectedVerse]
				}
			})
			this.setState({ selection, selectedClasses })
		}

		if (typeof onSelect === 'function') {
			onSelect({ verses: Object.keys(selection) })
		}
	}

	handleClick = (e) => {
		const { showFootnotes, onSelect } = this.props
		const isSelectable = typeof onSelect === 'function'

		e.preventDefault()

		let node = e.target
		while (
			typeof node !== 'undefined'
			&& typeof node.classList !== 'undefined'
			&& !node.classList.contains('verse')
			&& !node.classList.contains('note')
		) {
			node = node.parentNode
		}

		if (typeof node !== 'undefined' && typeof node.classList !== 'undefined') {
			if (isSelectable && node.classList.contains('verse')) {
				::this.handleVerseClick(node)
			} else if (showFootnotes && node.classList.contains('note')) {
				handleFootnoteClick(node)
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
			verseColors,
			onSelect,
			className
		} = this.props


		if (selectedClasses === null) {
			selectedClasses = {}
		}

		const style = {
			fontSize,
			fontFamily
		}

		const innerContent = { __html: content }

		let highlightedStyles = ''
		if (Array.isArray(verseColors) && verseColors.length > 0) {
			verseColors.forEach((verseColor) => {
				const [ usfm, color ] = verseColor
				const [ book, chapter, verse ] = usfm.split('.')
				if (typeof usfm === 'string' && typeof color === 'string') {
					highlightedStyles += `.bible-reader.${className} .bk${book} .ch${chapter} .v${verse} { background-color: #${color}; } `
				}
			})
		}

		let selectedStyles = ''
		if (Object.keys(selectedClasses).length > 0) {
			selectedStyles = `${Object.keys(selectedClasses).join(',')} { border-bottom: dotted 1px #777; }`
		}

		let footnoteStyles = ''
		if (showFootnotes) {
			footnoteStyles = `.bible-reader.${className} .note::before { display: inline-block; width: 12px; height: 12px; content: ''; background-image: url(/assets/footnote.png); background-size: contain; background-repeat: no-repeat; background-size: 12px; margin: 5px; cursor: pointer; cursor: context-menu; }`
		} else {
			footnoteStyles = `.bible-reader.${className} .note { display: none !important }`
		}

		const verseNumberStyles = `.bible-reader.${className} .label { display: ${showVerseNumbers ? 'inherit' : 'none'} }`
		const innerStyle = { __html: [selectedStyles, footnoteStyles, verseNumberStyles, highlightedStyles].join(' ') }

		const isSelectable = typeof onSelect === 'function'

		/* eslint-disable react/no-danger */
		return (
			<div
				className={`bible-reader ${className} ${!isSelectable ? 'not-selectable' : ''}`}
				dir={textDirection}
			>
				<style dangerouslySetInnerHTML={innerStyle} />
				<div
					className='reader'
					onClick={(isSelectable || showFootnotes) ? this.handleClick : null}
					dangerouslySetInnerHTML={innerContent}
					style={style}
				/>
			</div>
		)
		/* eslint-enable react/no-danger */
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
	verseColors: PropTypes.array,
	className: PropTypes.string
}

Chapter.defaultProps = {
	className: null,
	content: null,
	onSelect: null,
	textDirection: 'ltr',
	fontSize: USER_READER_SETTINGS
		? USER_READER_SETTINGS.fontSize
		: null,
	fontFamily: USER_READER_SETTINGS
		? USER_READER_SETTINGS.fontFamily
		: null,
	showFootnotes: USER_READER_SETTINGS
		? USER_READER_SETTINGS.showFootnotes
		: null,
	showVerseNumbers: USER_READER_SETTINGS
		? USER_READER_SETTINGS.showVerseNumbers
		: null,
	verseColors: []
}

export default Chapter
