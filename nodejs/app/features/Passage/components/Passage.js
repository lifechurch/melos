import React, { PropTypes } from 'react'
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
import DropDownArrow from '../../../components/DropDownArrow'
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
		versionId,
		text,
		hosts,
		serverLanguageTag,
		bible,
		images,
	} = props

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
			onClick={null}
		>
			<div className='flex-wrap' style={{ flex: 4, lineHeight: '1.5' }}>
				<div style={{ fontSize: '11px', width: '100%' }}><FormattedMessage id='version' /></div>
				<div style={{ fontSize: '14px', color: 'black' }}>{ versionAbbr }</div>
			</div>
			<div className='vertical-center' style={{ flex: 1 }}>
				<DropDownArrow fill="#DDDDDD" height={10} dir='down' />
			</div>
		</a>
	)

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
			<ShareSheet />
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
