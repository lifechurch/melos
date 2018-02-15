import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import imagesAction from '../action'
import getBibleModel from '../../../models/bible'
import getImagesModel from '../../../models/images'
import withVersion from '../../bible/hocs/withVersion'


function withImagesData(WrappedComponent) {
	class imagesData extends Component {
		constructor(props) {
			super(props)
			const version = props.bibleModel.pullVersion(this.versionId())
			const language_tag = this.languageTag(version)
			this.state = {
				language_tag,
			}
		}

		componentDidMount() {
			const { bibleModel, category, usfm, imagesModel } = this.props
			const version = bibleModel.pullVersion(this.versionId())
			const images = this.images({ category, usfm, imagesModel, version })
			const language_tag = this.languageTag(version)
			if (
				!(images && images.length > 0)
				&& !this.noImagesAvailable({ imagesModel, usfm, category, language_tag })
				&& (version && version.id)
			) {
				this.getImages({ language_tag })
			}
		}

		componentWillReceiveProps(nextProps) {
			const { category, usfm, imagesModel } = nextProps
			const { language_tag } = this.state

			const nextVersion = nextProps
				&& nextProps.bibleModel
				&& nextProps.bibleModel.versions
				&& nextProps.bibleModel.pullVersion(nextProps.version_id)
			const nextLanguageTag = this.languageTag(nextVersion)
			const newLanguage = nextLanguageTag
				&& (language_tag !== nextLanguageTag)
			const images = this.images({ category, usfm, imagesModel, language_tag: nextLanguageTag })
			const isAlreadyLoading = imagesModel.images.loading

			if (
				!(images && images.length > 0)
				&& !this.noImagesAvailable({ imagesModel, usfm, category, language_tag: nextLanguageTag })
				&& newLanguage
				&& !isAlreadyLoading
			) {
				this.getImages({ language_tag: nextLanguageTag })
			}
		}

		getImages = ({ page = 1, language_tag }) => {
			const { dispatch, usfm, category } = this.props
			const params = { page }
			if (category) {
				params.category = category
			}
			if (usfm) {
				params.usfm = Array.isArray(usfm)
					? usfm
					: usfm.split('+')
			}
			if (language_tag) {
				params.language_tag = language_tag
				this.setState({ language_tag })
				dispatch(imagesAction({
					method: 'items',
					params
				}))
			}
		}

		page = () => {
			const { imagesModel: { images }, bibleModel } = this.props
			const version = bibleModel.pullVersion(this.versionId())
			if (images && images.next_page) {
				this.getImages({
					page: images.next_page,
					language_tag: this.languageTag(version)
				})
			}
		}

		images = ({ category, usfm, language_tag, imagesModel }) => {
			return imagesModel
				&& imagesModel.filter({
					category,
					usfm,
					language_tag
				})
		}

		noImagesAvailable = ({ imagesModel, usfm, category, language_tag }) => {
			let noImagesAvailable = false
			const images = this.images({ category, imagesModel, usfm, language_tag })
			if (images.length < 1 && imagesModel.images.no_images && usfm) {
				if (Array.isArray(usfm)) {
					const foundUsfmThatCouldHaveImgs = usfm.some((verse) => {
						return !imagesModel.images.no_images.includes(verse.split('-')[0])
					})
					noImagesAvailable = !foundUsfmThatCouldHaveImgs
				} else {
					noImagesAvailable = imagesModel.images.no_images.includes(usfm)
				}
			}

			return noImagesAvailable
		}

		versionId = () => {
			const { serverLanguageTag, version_id } = this.props
			return version_id || getBibleVersionFromStorage(serverLanguageTag)
		}

		languageTag = (version) => {
			return version
				&& version.language
				&& version.language.iso_639_1
		}

		render() {
			const { imagesModel, category, usfm, bibleModel } = this.props

			const version = bibleModel.pullVersion(this.versionId())
			const language_tag = this.languageTag(version)
			return (
				<WrappedComponent
					{...this.props}
					images={this.images({ category, usfm, language_tag, imagesModel })}
					hasNoImages={this.noImagesAvailable({ imagesModel, usfm, category, language_tag })}
					handlePage={imagesModel.images && imagesModel.images.next_page && this.page}
				/>
			)
		}
	}

	imagesData.propTypes = {
		version_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		usfm: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
		category: PropTypes.string,
		imagesModel: PropTypes.object,
		bibleModel: PropTypes.object,
		dispatch: PropTypes.func.isRequired,
		serverLanguageTag: PropTypes.string.isRequired,
	}

	imagesData.defaultProps = {
		version_id: null,
		usfm: null,
		category: 'prerendered',
		imagesModel: null,
		bibleModel: null,
	}

	function mapStateToProps(state) {
		return {
			imagesModel: getImagesModel(state),
			bibleModel: getBibleModel(state),
			serverLanguageTag: state.serverLanguageTag,
		}
	}

	return connect(mapStateToProps, null)(withVersion(imagesData))
}

export default withImagesData
