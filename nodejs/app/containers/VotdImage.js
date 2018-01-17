import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import Helmet from 'react-helmet'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'
import parseVerseFromContent from '@youversion/utils/lib/bible/parseVerseContent'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import localizedLink from '@youversion/utils/lib/routes/localizedLink'
import Routes from '@youversion/utils/lib/routes/routes'
import Header from '../features/Header/components/Header'
import Footer from '../features/Footer/components/Footer'
import VotdText from '../features/Moments/components/types/VotdText'
import VotdImage from '../features/Moments/components/types/VotdImage'
import ShareSheet from '../widgets/ShareSheet/ShareSheet'
import PlansRelatedToReference from '../widgets/PlansRelatedToReference'
import Card from '../components/Card'


class VOTDView extends Component {
	componentDidMount() {
		const { moments, dispatch } = this.props
		if (!(moments && moments.configuration)) {
			dispatch(momentsAction({
				method: 'configuration',
			}))
		}
	}

	render() {
		const { location: { query }, params: { image_id, usfm }, moments, bible, intl, hosts, serverLanguageTag } = this.props

		const version_id = (query && query.version)
			|| getBibleVersionFromStorage(serverLanguageTag)
		const chapterUsfm = usfm && chapterifyUsfm(usfm)
		const ref = chapterUsfm && bible && bible.pullRef(chapterUsfm)
		let verse
		if (ref) {
			verse = parseVerseFromContent({
				usfms: usfm,
				fullContent: ref.content,
			}).text
		}
		const versionData = bible
			&& bible.versions
			&& bible.versions.byId
			&& bible.versions.byId[version_id]
			&& bible.versions.byId[version_id].response
		const refStrings = versionData
			&& versionData.books
			&& getReferencesTitle({
				bookList: versionData.books,
				usfmList: usfm,
			})
		const titleString = refStrings && refStrings.title
		const version_abbr = versionData
			&& versionData.local_abbreviation.toUpperCase()
		const title = `${intl.formatMessage({ id: 'votd' })} - ${titleString} (${version_abbr}) | The Bible App | Bible.com`
		const url = `${hosts && hosts.railsHost}${Routes.votdImage({
			usfm,
			image_id,
			query: {
				version: version_id
			},
			serverLanguageTag
		})}`
		let imgMeta = []
		if (image_id) {
			const src = moments
				&& moments.configuration
				&& moments.configuration.images.verse_images
				&& moments.configuration.images.verse_images.url
						.replace('{image_id}', image_id)
						.replace('{0}', 1280)
						.replace('{1}', 1280)
			imgMeta = [
				{ property: 'og:image', content: `https:${src}` },
				{ property: 'og:image:width', content: 1280 },
				{ property: 'og:image:height', content: 1280 },
				{ name: 'twitter:image', content: `https:${src}` }
			]
		}

		return (
			<div className='gray-background horizontal-center' style={{ padding: '50px 0' }}>
				<Helmet
					title={title}
					meta={[
						{ name: 'description', content: verse },
						{ property: 'og:title', content: title },
						{ property: 'og:url', content: url },
						{ property: 'og:description', content: verse },
						{ name: 'twitter:card', content: 'summary' },
						{ name: 'twitter:url', content: url },
						{ name: 'twitter:title', content: title },
						{ name: 'twitter:description', content: verse },
						{ name: 'twitter:site', content: '@YouVersion' },
					].concat(imgMeta)}
				/>
				<div className='yv-large-5 yv-medium-7 yv-small-11 votd-view'>
					<VotdImage usfm={usfm} image_id={image_id} />
				</div>
				<ShareSheet />
			</div>
		)
	}
}

VOTDView.propTypes = {
	moments: PropTypes.object,
	location: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string,
	bible: PropTypes.object,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

VOTDView.defaultProps = {
	moments: null,
	bible: null,
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		moments: getMomentsModel(state),
		bible: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(VOTDView))
