import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import Image from '../../../../../../app/components/Image'
import PreviewTypeText from './PreviewTypeText'
import PreviewTypeImage from './PreviewTypeImage'
import PreviewTypeLink from './PreviewTypeLink'
import PreviewTypePlan from './PreviewTypePlan'
import PreviewTypeAnnouncement from './PreviewTypeAnnouncement'
import PreviewTypeReference from './PreviewTypeReference'
import { FormattedMessage } from 'react-intl'

class PreviewFeed extends Component {

	render() {
		const { dispatch, event, reference } = this.props
		const { content, images } = event.item

		const contentList = content.map((c, i) => {
			const props = {
				...this.props,
				key: c.content_id,
				contentData: c.data,
				contentIndex: i
			}

			switch (c.type) {
				case 'text':
					return <PreviewTypeText {...props} />
					break

				case 'announcement':
					return <PreviewTypeAnnouncement {...props} />
					break

				case 'url':
					return <PreviewTypeLink {...props} />
					break

				case 'plan':
					return <PreviewTypePlan {...props} />
					break

				case 'reference':
					return <PreviewTypeReference {...props} />
					break

				case 'image':
					return <PreviewTypeImage {...props} />
					break

				default:
					return <div className='type' {...props}>{c.type}</div>
			}
		})

		let eventMeta
		if (event.item) {
			eventMeta = (<div className='actions'>
				<p>&bull; <FormattedMessage id="features.EventEdit.features.preview.components.PreviewFeed.share" /></p>
				<p>&bull; <FormattedMessage id="features.EventEdit.features.preview.components.PreviewFeed.locationsAndTimes" /></p>
			</div>)
		}

		return (
			<div className='preview'>
				<div className='device'>
					<div className="org">
						<p>{event.item.org_name}</p>
					</div>
					<div className='feed'>
						{ images ? <Image images={images} width={640} height={360} /> : null }
						<div className="type details">
							<h2>{event.item.title}</h2>
							<p>{event.item.description}</p>
							{eventMeta}
						</div>
						{contentList}
					</div>
				</div>
			</div>
		)
	}

}

PreviewFeed.propTypes = {

}

export default PreviewFeed
