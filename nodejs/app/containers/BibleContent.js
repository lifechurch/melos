import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
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
import { getBibleVersionFromStorage, chapterifyUsfm, buildCopyright } from '../lib/readerUtils'
import Routes from '../lib/routes'


class BibleContent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			audioPlaying: false,
			showFullChapter: false,
		}
	}

	componentDidMount() {
		const { bible, moments, dispatch, usfm, versionID, audio } = this.props

		this.version_id = versionID || getBibleVersionFromStorage()

		if (usfm && !(bible && bible.pullRef(usfm, versionID))) {
			dispatch(bibleReference(usfm))
		}
		if (!(bible && Immutable.fromJS(bible).hasIn(['versions', this.version_id]))) {
			dispatch(bibleAction({
				method: 'version',
				params: {
					id: this.version_id,
				}
			}))
		}
		if (usfm && !(moments && Immutable.fromJS(moments).hasIn(['verse-colors', usfm]))) {
			dispatch(momentsAction({
				method: 'verse_colors',
				params: {
					usfm: chapterifyUsfm(usfm),
					version_id: this.version_id
				},
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

	render() {
		const {
			usfm,
			versionID,
			bible,
			moments,
			audio,
			showContent,
			showAudio,
			showVerseAction,
			showChapterPicker,
			showVersionPicker,
			hosts,
			intl
		} = this.props

		const ref = bible && bible.pullRef(usfm, versionID) ?
								bible.pullRef(usfm, versionID) :
								null
		const version = bible && Immutable.fromJS(bible).hasIn(['versions', this.version_id]) ?
										Immutable.fromJS(bible).getIn(['versions', this.version_id]).toJS() :
										null
		const hasAudio = audio && Immutable.fromJS(audio).hasIn(['chapter', chapterifyUsfm(usfm)])

		return (
			<div>
				<div className='plan-ref'>
					<div className='plan-reader-heading'>
						{/* <div className='ref-heading'>
							{`${refHeading} ${version ? version.local_abbreviation.toUpperCase() : ''}`}
						</div> */}
						<AudioPopup
							audio={hasAudio ? Immutable.fromJS(audio).getIn(['chapter', chapterifyUsfm(usfm)]).toJS() : null}
							hosts={hosts}
							enabled={hasAudio}
							// onAudioComplete={onAudioComplete}
							// // if we're not rendering the entire chapter, the audio should start
							// // at the verse start, otherwise, it starts at the beginning of the chapter
							// startTime={showChapterButton ? audioStart : 0}
							// stopTime={showChapterButton ? audioStop : null}
							// playing={audioPlaying}
						/>
					</div>
					{
						showContent &&
						<Chapter
							content={ref ? ref.content : null}
							verseColors={moments ? moments.verseColors : null}
							// onSelect={this.handleOnVerseSelect}
							// textDirection={textDirection}
							ref={(chapter) => { this.chapterInstance = chapter }}
						/>
					}
					{
						version &&
						<ChapterCopyright {...buildCopyright(intl.formatMessage, version)} />
					}
					{/* {
						showChapterButton &&
						<div className='buttons'>
							<button className='chapter-button solid-button' onClick={this.handleGetChapter}>
								<FormattedMessage id='Reader.read chapter' />
							</button>
						</div>
					} */}
					<VerseAction
						// props
						version={version}
						verseColors={moments ? moments.verseColors : null}
						// isRtl={isRtl}
						// highlightColors={highlightColors}
						// momentsLabels={momentsLabels}
						// verses={bibleVerses}
						// references={bibleReferences}
						// // state
						// selection={verseSelection}
						// deletableColors={deletableColors}
						// onClose={this.handleOnVerseClear}
					/>
				</div>
			</div>
		)
	}
}

BibleContent.propTypes = {
	showContent: PropTypes.bool,
	showAudio: PropTypes.bool,
	showVerseAction: PropTypes.bool,
	showChapterPicker: PropTypes.bool,
	showVersionPicker: PropTypes.bool,
}

BibleContent.defaultProps = {
	showContent: true,
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
