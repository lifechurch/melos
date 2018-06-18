import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getImagesModel from '@youversion/api-redux/lib/models/images'
import withImagesData from '@youversion/api-redux/lib/endpoints/images/hocs/withImages'
import withReferenceData from '@youversion/api-redux/lib/endpoints/bible/hocs/withReference'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import Heading1 from '@youversion/melos/dist/components/typography/Heading1'
import Routes from '@youversion/utils/lib/routes/routes'
import expandUsfm from '@youversion/utils/lib/bible/expandUsfm'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'
import VersionPicker from '../../Bible/components/versionPicker/VersionPicker'
import { buildMeta } from '../../../lib/readerUtils'
import ReferenceMoment from '../../Moments/components/types/ReferenceMoment'
import ImagesMoment from '../../Moments/components/types/VotdImage'
import ShareSheet from '../../../widgets/ShareSheet/ShareSheet'
import PlansRelatedToReference from '../../../widgets/PlansRelatedToReference'


function Passage(props) {
	const {
		usfm,
		titleWithAbbr,
		versionAbbr,
		version_id,
		text,
		hosts,
		serverLanguageTag,
		bible,
		images,
	} = props

	const version = bible && bible.pullVersion(version_id)
	const title = `${titleWithAbbr}; ${text}`
	const url = `${hosts.railsHost}${Routes.reference({
		usfm,
		version_id,
		version_abbr: versionAbbr,
		serverLanguageTag,
	})}`
	const metaLink = (version && version.id && buildMeta({ hosts, version, usfm }).link) || []
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
		<VersionPicker
			key='version-picker'
			version_id={version_id}
			selectedChapter={chapterifyUsfm(usfm)}
			linkBuilder={(versionId, usfmString, abbr) => {
				return Routes.reference({
					usfm,
					version_id: versionId,
					version_abbr: abbr,
					serverLanguageTag,
				})
			}}
		/>
	)

	const usfms = expandUsfm(usfm, false)
	return (
		<div>
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
			<div style={{ width: '100%', marginBottom: '25px', marginTop: '-40px' }}>
				<Heading1>{ titleWithAbbr }</Heading1>
			</div>
			<div className='gray-background horizontal-center' style={{ padding: '50px 0' }}>
				<div className='yv-large-5 yv-medium-7 yv-small-11 votd-view'>
					<ReferenceMoment usfm={usfm} version_id={version_id} leftFooter={[versionDropdown]} />
					<ImagesMoment usfm={usfms} version_id={version_id} />
					<PlansRelatedToReference serverLanguageTag={serverLanguageTag} usfm={usfms.slice(0, 4).join('+')} version_id={version_id} />
				</div>
				<ShareSheet />
			</div>
		</div>
	)
}

Passage.propTypes = {
	serverLanguageTag: PropTypes.string,
	bible: PropTypes.object,
	hosts: PropTypes.object.isRequired,
	usfm: PropTypes.string.isRequired,
	titleWithAbbr: PropTypes.string.isRequired,
	versionAbbr: PropTypes.string.isRequired,
	version_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
