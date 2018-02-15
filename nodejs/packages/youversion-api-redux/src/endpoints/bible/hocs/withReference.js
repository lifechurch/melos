import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import parseVerseFromContent from '@youversion/utils/lib/bible/parseVerseContent'
import expandUsfm from '@youversion/utils/lib/bible/expandUsfm'
import Routes from '@youversion/utils/lib/routes/routes'
import bibleActions from '../action'
import withVersion from './withVersion'
import getBibleModel from '../../../models/bible'


function withReferenceData(WrappedComponent) {
	class referenceData extends Component {
		constructor(props) {
			super(props)
			this.state = {
				usfm: props.usfm,
				version_id: props.version_id,
			}
		}

		componentDidMount() {
			const { usfm, bibleModel } = this.props
			this.getChapter(usfm, this.versionId(), bibleModel)
		}

		componentWillReceiveProps(nextProps) {
			const { usfm } = this.props

			const prevId = this.versionId()
			const hasNewUsfm = nextProps.usfm
				&& (nextProps.usfm !== usfm)
			const hasNewId = nextProps.version_id
				&& (nextProps.version_id !== prevId)

			if (hasNewId || hasNewUsfm) {
				this.getChapter(nextProps.usfm, nextProps.version_id, nextProps.bibleModel)
			}
		}

		getChapter = (usfm, version_id, bibleModel) => {
			const { dispatch } = this.props
			const ref = bibleModel
				&& bibleModel.pullRef(chapterifyUsfm(usfm), version_id)
			const hasRef = ref && ref.content
			const isLoading = ref && ref.loading
			if (!hasRef && !isLoading) {
				dispatch(bibleActions({
					method: 'chapter',
					params: {
						id: version_id,
						reference: chapterifyUsfm(usfm),
					}
				}))
			}
			this.setState({ usfm, version_id })
		}

		versionId = () => {
			const { serverLanguageTag } = this.props
			const { version_id } = this.state
			return version_id || getBibleVersionFromStorage(serverLanguageTag)
		}

		bibleContent = () => {
			const { bibleModel, processContent } = this.props
			const { usfm, version_id } = this.state

			const content = { html: null, text: null }

			const ref = usfm
				&& chapterifyUsfm(usfm)
				&& bibleModel
				&& bibleModel.pullRef(chapterifyUsfm(usfm), version_id)
			if (ref && ref.content) {
				this.verseContent = parseVerseFromContent({
					usfms: expandUsfm(usfm),
					fullContent: ref.content,
				})
				content.html = processContent
					? processContent(this.verseContent.html)
					: this.verseContent.html
				content.text = processContent
					? processContent(this.verseContent.text)
					: this.verseContent.text
			}

			return content
		}

		referenceStrings = () => {
			const { bibleModel } = this.props
			const { usfm } = this.state

			const strings = {
				usfm: '',
				title: '',
				version_abbr: '',
				reference: '',
			}

			if (!this.hasNoContentAvailable) {
				const versionData = bibleModel.pullVersion(this.versionId())
				this.refStrings = versionData
					&& versionData.books
					&& getReferencesTitle({
						bookList: versionData.books,
						usfmList: usfm && expandUsfm(usfm),
					})
				const version_abbr = versionData
					&& versionData.local_abbreviation
					&& versionData.local_abbreviation.toUpperCase()
				strings.version_abbr = version_abbr
				strings.usfm = this.refStrings && this.refStrings.usfm
				strings.reference = this.refStrings && this.refStrings.title
				strings.title = this.refStrings && `${this.refStrings.title} ${version_abbr}`
			}

			return strings
		}

		render() {
			const { serverLanguageTag, bibleModel } = this.props
			const { usfm } = this.state

			const version_id = this.versionId()
			this.hasNoContentAvailable = usfm
				&& chapterifyUsfm(usfm)
				&& bibleModel
				&& bibleModel.pullRef(chapterifyUsfm(usfm), version_id)
				&& bibleModel.pullRef(chapterifyUsfm(usfm), version_id).errors
				&& bibleModel.pullRef(chapterifyUsfm(usfm), version_id).errors.length > 0
			const { html, text } = this.bibleContent()
			const { title, version_abbr, reference, usfm: usfmString } = this.referenceStrings()

			const linkParams = {
				version_id,
				usfm,
				version_abbr,
				serverLanguageTag
			}
			const referenceLink = Routes.reference(linkParams)
			linkParams.usfm = chapterifyUsfm(usfm)
			const chapterLink = Routes.reference(linkParams)

			return (
				<WrappedComponent
					{...this.props}
					referenceTitle={reference}
					titleWithAbbr={title}
					usfmTitle={usfmString}
					versionAbbr={version_abbr}
					usfm={usfm}
					html={html}
					text={text}
					referenceLink={referenceLink}
					chapterLink={chapterLink}
					versionId={version_id}
					noContentAvailable={this.hasNoContentAvailable}
				/>
			)
		}
	}

	referenceData.propTypes = {
		bibleModel: PropTypes.object.isRequired,
		serverLanguageTag: PropTypes.string,
		version_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		usfm: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
		processContent: PropTypes.func,
		dispatch: PropTypes.func.isRequired,
	}

	referenceData.defaultProps = {
		version_id: null,
		serverLanguageTag: 'en',
		processContent: null,
	}

	function mapStateToProps(state) {
		return {
			bibleModel: getBibleModel(state),
			auth: state.auth,
			serverLanguageTag: state.serverLanguageTag
		}
	}

	return connect(mapStateToProps, null)(withVersion(referenceData))
}

export default withReferenceData
