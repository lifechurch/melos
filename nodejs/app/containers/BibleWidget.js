import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
// utils
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
// components
import BibleHeader from './BibleHeader'
import BibleContent from './BibleContent'


class BibleWidget extends Component {
	constructor(props) {
		super(props)
		this.state = {
			usfm: props.usfm,
			version_id: props.version_id || getBibleVersionFromStorage(),
			showFullChapter: false,
			verseSelection: {},
			deletableColors: [],
		}
	}

	componentWillReceiveProps(nextProps) {
		const { usfm, version_id } = this.state
		// if we're updating the usfm from props then let's get it
		if (usfm && nextProps.usfm && this.props.usfm !== nextProps.usfm && usfm !== nextProps.usfm) {
			this.setState({ usfm: nextProps.usfm })
		}
		// if we're updating the version from props then let's get it
		if (version_id && nextProps.version_id && this.props.version_id !== nextProps.version_id && version_id !== nextProps.version_id) {
			this.setState({ version_id: nextProps.version_id })
		}
	}

	localizedLink = (link) => {
		const { language_tag, serverLanguageTag } = this.props
		const languageTag = language_tag || serverLanguageTag || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	handleUpdateVersion = (version_id) => {
		if (version_id) {
			this.setState({ version_id })
		}
	}

	handleUpdateUsfm = (usfm) => {
		if (usfm) {
			this.setState({ usfm })
		}
	}

	render() {
		const {
			showContent,
			showGetChapter,
			showAudio,
			stickyHeader,
			showCopyright,
			showVerseAction,
			showChapterPicker,
			showVersionPicker,
			customHeaderClass,
			onAudioComplete,
			audioPlaying
		} = this.props
		const { usfm, version_id } = this.state

		return (
			<div className='bible'>
				<BibleHeader
					audioPlaying={audioPlaying}
					onAudioComplete={onAudioComplete}
					customHeaderClass={customHeaderClass}
					showAudio={showAudio}
					showVersionPicker={showVersionPicker}
					showChapterPicker={showChapterPicker}
					sticky={stickyHeader}
					usfm={usfm}
					version_id={version_id}
					localizedLink={this.localizedLink}
					onVersionClick={this.handleUpdateVersion}
				/>
				{
					showContent
						&& (
							<BibleContent
								usfm={usfm}
								version_id={version_id}
								onUpdateVersion={this.handleUpdateVersion}
								onUpdateUsfm={this.handleUpdateUsfm}
								showGetChapter={showGetChapter}
								showCopyright={showCopyright}
								showVerseAction={showVerseAction}
							/>
						)
				}
			</div>
		)
	}
}

BibleWidget.propTypes = {
	usfm: PropTypes.string.isRequired,
	version_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	showContent: PropTypes.bool,
	showCopyright: PropTypes.bool,
	showGetChapter: PropTypes.bool,
	showAudio: PropTypes.bool,
	showVerseAction: PropTypes.bool,
	showChapterPicker: PropTypes.bool,
	showVersionPicker: PropTypes.bool,
	stickyHeader: PropTypes.bool,
	customHeaderClass: PropTypes.string,
	language_tag: PropTypes.string,
	serverLanguageTag: PropTypes.string.isRequired,
	onAudioComplete: PropTypes.func,
	audioPlaying: PropTypes.bool
}

BibleWidget.defaultProps = {
	showContent: true,
	showCopyright: true,
	showGetChapter: true,
	showAudio: true,
	showVerseAction: true,
	showChapterPicker: true,
	showVersionPicker: true,
	stickyHeader: false,
	version_id: null,
	customHeaderClass: null,
	language_tag: null,
	onAudioComplete: () => {},
	audioPlaying: false
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(injectIntl(BibleWidget))
