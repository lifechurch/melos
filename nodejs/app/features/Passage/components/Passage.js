import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Helmet from 'react-helmet'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getImagesModel from '@youversion/api-redux/lib/models/images'
import withImagesData from '@youversion/api-redux/lib/endpoints/images/hocs/withImages'
import withReferenceData from '@youversion/api-redux/lib/endpoints/bible/hocs/withReference'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import Routes from '@youversion/utils/lib/routes/routes'
import localeVersions from '@youversion/stringer-things/dist/config/localeVersions.json'
import Card from '@youversion/melos/dist/components/containers/Card'
import Link from '@youversion/melos/dist/components/links/Link'
import VerticalSpace from '@youversion/melos/dist/components/layouts/VerticalSpace'
import VersionPicker from '../../Bible/components/versionPicker/VersionPicker'
import DropDownArrow from '../../../components/DropDownArrow'
import FullscreenDrawer from '../../../components/FullscreenDrawer'
import { buildMeta } from '../../../lib/readerUtils'
import ReferenceMoment from '../../Moments/components/types/ReferenceMoment'
import ImagesMoment from '../../Moments/components/types/VotdImage'
import ShareSheet from '../../../widgets/ShareSheet/ShareSheet'
import PlansRelatedToReference from '../../../widgets/PlansRelatedToReference'


class Passage extends Component {

	constructor(props) {
		super(props)
		this.state = {
			versionsOpen: false,
		}
	}

	handleOpenVersions = () => {
		this.setState({ versionsOpen: true })
	}

	render() {
		const {
			usfm,
			titleWithAbbr,
			versionAbbr,
			versionId,
			text,
			hosts,
			serverLanguageTag,
			bible,
			images,
		} = this.props
		const { versionsOpen } = this.state

		const version = bible && bible.pullVersion(versionId)
		const title = `${titleWithAbbr}; ${text}`
		const url = `${hosts.railsHost}${Routes.reference({
			usfm,
			version_id: versionId,
			version_abbr: versionAbbr,
			serverLanguageTag,
		})}`
		const metaLink = (version && buildMeta({ hosts, version, usfm }).link) || []
		// const nextLink = localizedLink(`/bible/${versionId}/${primaryVersion.nextVerse}.${version.local_abbreviation.toLowerCase()}`)
		// const prevLink = localizedLink(`/bible/${versionId}/${primaryVersion.previousVerse}.${version.local_abbreviation.toLowerCase()}`)
		let imgMeta = []
		if (images && images.length > 0) {
			const img = images[0]
			const src = selectImageFromList({
				images: img.renditions,
				width: 640,
				height: 640,
			}).url
			imgMeta = [
				{ property: 'og:image', content: `https:${src}` },
				{ property: 'og:image:width', content: 640 },
				{ property: 'og:image:height', content: 640 },
				{ name: 'twitter:image', content: `https:${src}` }
			]
		}

		const versionDropdown = (
			<a
				tabIndex={0}
				className="dropdown-button vertical-center"
				target="_self"
				onClick={this.handleOpenVersions}
			>
				<div className='flex-wrap' style={{ flex: 4, lineHeight: '1.5' }}>
					<div style={{ fontSize: '11px', width: '100%' }}><FormattedMessage id='version' /></div>
					<div style={{ fontSize: '14px', color: 'black' }}>{ versionAbbr }</div>
				</div>
				<div className='vertical-center' style={{ flex: 1 }}>
					<DropDownArrow fill="#DDDDDD" height={10} dir='down' />
				</div>
			</a>
			// <VersionPicker
			// 	version={version}
			// 	languages={bible.languages.all}
			// 	versions={bible.versions}
			// 	recentVersions={this.state.recentVersions}
			// 	languageMap={bible.languages.map}
			// 	selectedChapter={this.state.selectedChapter}
			// 	alert={this.state.chapterError}
			// 	getVersions={this.getVersions}
			// 	cancelDropDown={this.state.versionDropDownCancel}
			// 	extraClassNames="main-version-picker-container"
			// 	ref={(vpicker) => { this.versionPickerInstance = vpicker }}
			// 	linkBuilder={(version_id, usfmString, abbr) => {
			// 		return Routes.reference({
			// 			usfm,
			// 			version_id,
			// 			version_abbr: abbr,
			// 			serverLanguageTag,
			// 		})
			// 	}}
			// />
		)

		const versions = localeVersions.en && localeVersions.en.text

		return (
			<div className='gray-background horizontal-center' style={{ padding: '50px 0' }}>
				<Helmet
					title={title}
					meta={[
						{ name: 'description', content: text },
						{ property: 'og:title', content: title },
						{ property: 'og:url', content: url },
						{ property: 'og:description', content: text },
						{ name: 'twitter:card', content: 'summary' },
						{ name: 'twitter:url', content: url },
						{ name: 'twitter:title', content: title },
						{ name: 'twitter:description', content: text },
						{ name: 'twitter:site', content: '@YouVersion' },
					].concat(imgMeta)}
					link={metaLink}
				/>
				<div className='yv-large-5 yv-medium-7 yv-small-11 votd-view'>
					<ReferenceMoment usfm={usfm} version_id={versionId} leftFooter={[versionDropdown]} />
					<ImagesMoment usfm={usfm} version_id={versionId} />
					<PlansRelatedToReference usfm={usfm} version_id={versionId} />
				</div>
				<FullscreenDrawer
					isOpen={versionsOpen}
					onClose={() => { this.setState({ versionsOpen: false }) }}
					className='yv-large-3 yv-small-11 centered'
					title={<FormattedMessage id='select version' />}
				>
					<VerticalSpace>
						{
							versions && versions.map((v) => {
								return (
									<Link
										key={v}
										to={Routes.reference({
											version_id: v,
											usfm,
											version_abbr: versionAbbr,
											serverLanguageTag
										})}
									>
										<Card customClass='horizontal-center flex-wrap'>
											{ v }
										</Card>
									</Link>
								)
							})
							}
					</VerticalSpace>
				</FullscreenDrawer>
				<ShareSheet />
			</div>
		)
	}
}

Passage.propTypes = {
	serverLanguageTag: PropTypes.string,
	bible: PropTypes.object,
	hosts: PropTypes.object.isRequired,
	usfm: PropTypes.string.isRequired,
	titleWithAbbr: PropTypes.string.isRequired,
	versionAbbr: PropTypes.string.isRequired,
	versionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	text: PropTypes.string.isRequired,
	images: PropTypes.array,
}

Passage.defaultProps = {
	moments: null,
	bible: null,
	images: null,
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		bible: getBibleModel(state),
		moments: getMomentsModel(state),
		images: getImagesModel(state),
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(withImagesData(withReferenceData(Passage)))
