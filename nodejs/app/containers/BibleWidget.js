import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import rtlDetect from 'rtl-detect'
import { routeActions } from 'react-router-redux'
import Immutable from 'immutable'
// actions
import bibleAction from '@youversion/api-redux/lib/endpoints/bible/action'
import audioAction from '@youversion/api-redux/lib/endpoints/audio/action'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import bibleReference from '@youversion/api-redux/lib/batchedActions/bibleReference'
// models
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import getAudioModel from '@youversion/api-redux/lib/models/audio'
// components
import BibleHeader from './BibleHeader'
import BibleContent from './BibleContent'
// utils
import { getBibleVersionFromStorage, chapterifyUsfm, buildCopyright, isVerseOrChapter, parseVerseFromContent } from '../lib/readerUtils'
import { getReferencesTitle } from '../lib/usfmUtils'
import Routes from '../lib/routes'


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
			title,
			customHeaderClass,
		} = this.props
		const { usfm, version_id } = this.state

		return (
			<div className='bible'>
				<BibleHeader
					title={title}
					customHeaderClass={customHeaderClass}
					showAudio={showAudio}
					showVersionPicker={showVersionPicker}
					sticky={stickyHeader}
					usfm={usfm}
					version_id={version_id}
					localizedLink={this.localizedLink}
					onVersionClick={this.handleUpdateVersion}
				/>
				<BibleContent
					usfm={usfm}
					version_id={version_id}
					onUpdateVersion={this.handleUpdateVersion}
					onUpdateUsfm={this.handleUpdateUsfm}
				/>
			</div>
		)
	}
}

BibleWidget.propTypes = {
	showContent: PropTypes.bool,
	showCopyright: PropTypes.bool,
	showGetChapter: PropTypes.bool,
	showAudio: PropTypes.bool,
	showVerseAction: PropTypes.bool,
	showChapterPicker: PropTypes.bool,
	showVersionPicker: PropTypes.bool,
	stickyHeader: PropTypes.bool,
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
}

function mapStateToProps(state) {
	console.log('BIBLE', getBibleModel(state))
	console.log('MOMENTS', getMomentsModel(state))
	console.log('AUDIO', getAudioModel(state))
	return {
		bible: getBibleModel(state),
		moments: getMomentsModel(state),
		audio: getAudioModel(state),
		auth: state.auth,
		hosts: state.hosts,
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(injectIntl(BibleWidget))
