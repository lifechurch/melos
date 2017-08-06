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
import AudioPopup from '../features/Bible/components/audio/AudioPopup'
// utils
import { getBibleVersionFromStorage, chapterifyUsfm, buildCopyright, isVerseOrChapter, parseVerseFromContent } from '../lib/readerUtils'
import { getReferencesTitle } from '../lib/usfmUtils'
import Routes from '../lib/routes'


class BibleContent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			usfm: props.usfm,
			audioPlaying: false,
			showFullChapter: false,
			verseSelection: {},
			deletableColors: [],
		}
	}

	componentDidMount() {
		const { usfm } = this.state

		this.getBibleData(usfm)
	}

	componentWillReceiveProps(nextProps) {
		const { usfm } = this.state
		// if we're updating the usfm from props then let's get it
		if (usfm && nextProps.usfm && this.props.usfm !== nextProps.usfm && usfm !== nextProps.usfm) {
			this.getBibleData(nextProps.usfm)
		}
	}

	getReference = (usfm, versionID = null) => {
		const { bible, dispatch } = this.props
		if (usfm) {
			this.setState({ usfm })
			// if we don't already have it in app state,
			// let's get it
			if (!(bible && bible.pullRef(usfm, versionID))) {
				dispatch(bibleReference(usfm))
			}
		}
	}

	getBibleData = (usfm) => {
		const { bible, moments, dispatch, versionID, audio } = this.props

		this.getReference(usfm, this.version_id)

		if (!(bible && Immutable.fromJS(bible).hasIn(['versions', this.version_id]))) {
			dispatch(bibleAction({
				method: 'version',
				params: {
					id: this.version_id,
				}
			}))
		}
		if (usfm && !(moments && Immutable.fromJS(moments).hasIn(['verse-colors', chapterifyUsfm(usfm)]))) {
			dispatch(momentsAction({
				method: 'verse_colors',
				params: {
					usfm: chapterifyUsfm(usfm),
					version_id: this.version_id
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
		if (usfm && !(audio && Immutable.fromJS(audio).hasIn(['chapter', chapterifyUsfm(usfm)]))) {
			dispatch(audioAction({
				method: 'chapter',
				params: {
					reference: chapterifyUsfm(usfm),
					version_id: this.version_id
				},
			}))
		}
	}

	handleVerseSelect = ({ verses }) => {
		const { hosts, moments } = this.props

		if (verses) {
			const { title, usfm } = getReferencesTitle({
				bookList: this.version ? this.version.books : null,
				usfmList: verses
			})
			const { html, text } = parseVerseFromContent({
				usfms: verses,
				fullContent: this.ref ? this.ref.content : null
			})
			const refUrl = `${hosts.railsHost}/bible/${this.version_id}/${usfm}`

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
				verseSelection: Immutable.fromJS({}).merge({
					human: title,
					url: refUrl,
					text,
					verseContent: html,
					verses,
					version: this.version_id
				}).toJS()
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
			versionID,
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
		const { usfm, verseSelection, deletableColors } = this.state

		this.ref = bible && bible.pullRef(usfm, versionID)
			? bible.pullRef(usfm, versionID)
			: null
		this.version_id = versionID || getBibleVersionFromStorage()
		this.version = bible && Immutable.fromJS(bible).hasIn(['versions', `${this.version_id}`, 'response'])
			? Immutable.fromJS(bible).getIn(['versions', `${this.version_id}`, 'response']).toJS()
			: null
		const hasAudio = audio && Immutable.fromJS(audio).hasIn(['chapter', chapterifyUsfm(usfm)])

		return (
			<div className='bible-content'>
				<div className='plan-reader-heading'>
					<AudioPopup
						audio={hasAudio ? Immutable.fromJS(audio).getIn(['chapter', chapterifyUsfm(usfm)]).toJS() : null}
						hosts={hosts}
						enabled={hasAudio}
					/>
				</div>
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
