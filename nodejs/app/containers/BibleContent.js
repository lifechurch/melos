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
import Chapter from '../features/Bible/components/content/Chapter'
import VerseAction from '../features/Bible/components/verseAction/VerseAction'
import ChapterCopyright from '../features/Bible/components/content/ChapterCopyright'
// utils
import { getBibleVersionFromStorage, chapterifyUsfm, buildCopyright, isVerseOrChapter, parseVerseFromContent } from '../lib/readerUtils'
import { getReferencesTitle } from '../lib/usfmUtils'
import Routes from '../lib/routes'


class BibleContent extends Component {
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

	componentDidMount() {
		const { usfm, version_id } = this.state
		this.getBibleData(usfm, version_id)
	}

	componentWillReceiveProps(nextProps) {
		const { usfm, version_id } = this.state
		// if we're updating the usfm from props then let's get it
		if (usfm && nextProps.usfm && this.props.usfm !== nextProps.usfm && usfm !== nextProps.usfm) {
			this.getBibleData(nextProps.usfm, version_id)
		}
		// if we're updating the version from props then let's get it
		if (version_id && nextProps.version_id && this.props.version_id !== nextProps.version_id && version_id !== nextProps.version_id) {
			this.getBibleData(usfm, nextProps.version_id)
		}
	}

	getReference = (usfm, version_id = null) => {
		const { bible, onUpdateVersion, onUpdateUsfm, dispatch } = this.props
		if (usfm) {
			this.setState({ usfm, version_id })
			onUpdateUsfm(usfm)
			// if we don't already have it in app state,
			// let's get it
			if (!(bible && bible.pullRef(usfm, version_id))) {
				dispatch(bibleReference(usfm, version_id))
			}
		}
	}

	getBibleData = (usfm, version_id) => {
		const { bible, moments, dispatch, audio } = this.props

		this.getReference(usfm, version_id)

		if (!(bible && Immutable.fromJS(bible).hasIn(['versions', 'byId', version_id]))) {
			dispatch(bibleAction({
				method: 'version',
				params: {
					id: version_id,
				}
			}))
		}
		if (usfm && !(moments && Immutable.fromJS(moments).hasIn(['verse-colors', chapterifyUsfm(usfm)]))) {
			dispatch(momentsAction({
				method: 'verse_colors',
				params: {
					usfm: chapterifyUsfm(usfm),
					version_id
				},
				auth: true,
			}))
		}
		if (usfm && !(moments && Immutable.fromJS(moments).hasIn(['labels']))) {
			dispatch(momentsAction({
				method: 'labels',
				auth: true,
			}))
		}
		if (usfm && !(moments && Immutable.fromJS(moments).hasIn(['colors']))) {
			dispatch(momentsAction({
				method: 'colors',
				auth: true,
			}))
		}
	}

	handleVerseSelect = ({ verses }) => {
		const { hosts, moments } = this.props
		const { version_id } = this.state

		if (verses) {
			const { title, usfm } = getReferencesTitle({
				bookList: this.version ? this.version.books : null,
				usfmList: verses
			})
			const { html, text } = parseVerseFromContent({
				usfms: verses,
				fullContent: this.ref ? this.ref.content : null
			})
			const refUrl = `${hosts.railsHost}/bible/${version_id}/${usfm}`

			// get the verses that are both selected and already have a highlight
			// color associated with them, so we can allow the user to delete them
			const deletableColors = []
			verses.forEach((selectedVerse) => {
				if (moments.verseColors) {
					moments.verseColors.forEach((colorVerse) => {
						if (selectedVerse === colorVerse[0]) {
							deletableColors.push(colorVerse[1])
						}
					})
				}
			})
			this.setState({
				deletableColors,
				verseSelection: {
					human: title,
					url: refUrl,
					text,
					verseContent: html,
					verses,
					version: version_id
				}
			})
		}
	}

	handleVerseClear = () => {
		if (typeof this.chapterInstance !== 'undefined' && this.chapterInstance) {
			this.chapterInstance.clearSelection()
		}
		this.setState({ verseSelection: {}, deletableColors: [] })
	}

	render() {
		const {
			bible,
			moments,
			audio,
			showContent,
			showGetChapter,
			showAudio,
			showCopyright,
			showVerseAction,
			showChapterPicker,
			showVersionPicker,
			auth,
			hosts,
			dispatch,
			intl
		} = this.props
		const { usfm, version_id, verseSelection, deletableColors } = this.state

		this.ref = bible && bible.pullRef(usfm, version_id)
			? bible.pullRef(usfm, version_id)
			: null
		this.version = bible && Immutable.fromJS(bible).hasIn(['versions', 'byId', `${version_id}`, 'response'])
			? Immutable.fromJS(bible).getIn(['versions', 'byId', `${version_id}`, 'response']).toJS()
			: null

		return (
			<div className='bible-content'>
				{
					showContent &&
					<Chapter
						content={this.ref ? this.ref.content : null}
						verseColors={moments ? moments.verseColors : null}
						onSelect={this.handleVerseSelect}
						// textDirection={textDirection}
						ref={(chapter) => { this.chapterInstance = chapter }}
					/>
				}
				{
					showCopyright &&
					this.version &&
					'id' in this.version &&
					<ChapterCopyright {...buildCopyright(intl.formatMessage, this.version)} />
				}
				{
					showGetChapter &&
					usfm &&
					isVerseOrChapter(usfm.split('+')[0]).isVerse &&
					<div className='buttons'>
						<button
							className='chapter-button solid-button'
							onClick={() => {
								this.getReference(chapterifyUsfm(usfm))
							}}
						>
							<FormattedMessage id='Reader.read chapter' />
						</button>
					</div>
				}
				<VerseAction
						// props
					version={this.version}
					verseColors={moments ? moments.verseColors : null}
						// isRtl={isRtl}
					highlightColors={moments ? moments.colors : null}
					momentsLabels={moments ? moments.labels : null}
					auth={auth}
					dispatch={dispatch}
						// state
					selection={verseSelection}
					deletableColors={deletableColors}
					onClose={this.handleVerseClear}
				/>
			</div>
		)
	}
}

BibleContent.propTypes = {
	showContent: PropTypes.bool,
	showCopyright: PropTypes.bool,
	showGetChapter: PropTypes.bool,
	showAudio: PropTypes.bool,
	showVerseAction: PropTypes.bool,
	showChapterPicker: PropTypes.bool,
	showVersionPicker: PropTypes.bool,
}

BibleContent.defaultProps = {
	showContent: true,
	showCopyright: true,
	showGetChapter: true,
	showAudio: true,
	showVerseAction: true,
	showChapterPicker: true,
	showVersionPicker: true,
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
	}
}

export default connect(mapStateToProps, null)(injectIntl(BibleContent))
