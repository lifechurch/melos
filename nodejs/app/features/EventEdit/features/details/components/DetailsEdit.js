import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'
import Textarea from '../../../../../../app/components/Textarea'
import Img from '../../../../../../app/components/Image'
import ErrorMessage from '../../../../../../app/components/ErrorMessage'
import ActionCreators from '../actions/creators'

const PREFERRED_IMAGE_WIDTH = 1440
const PREFERRED_IMAGE_HEIGHT = 810
const PREFERRED_IMAGE_RATIO = PREFERRED_IMAGE_HEIGHT / PREFERRED_IMAGE_WIDTH
const MIN_IMAGE_WIDTH = 960
const MAX_IMAGE_WIDTH = 1920

class DetailsEdit extends Component {

	onDrop(files) {
		const { dispatch, event, handleChange, intl } = this.props

		if (files[0].type === 'image/jpeg' || files[0].type === 'image/jpg') {
			dispatch(ActionCreators.imgUpload({})).then((response_init) => {
							// Upload to S3
				const formData = new FormData()
				formData.append('AWSAccessKeyId', response_init.params.AWSAccessKeyId)
				formData.append('key', response_init.params.key)
				formData.append('policy', response_init.params.policy)
				formData.append('x-amz-storage-class', response_init.params['x-amz-storage-class'])
				formData.append('Signature', response_init.params.signature)
				formData.append('file', files[0])

				const reader = new FileReader()
				reader.onload = (loadEvent) => {
					const image = new Image()
					const handleLoad = () => {
						if ((PREFERRED_IMAGE_RATIO !== (image.height / image.width)) || (image.width < MIN_IMAGE_WIDTH) || (image.width > MAX_IMAGE_WIDTH)) {
							const errorMessage = intl.formatMessage({ id: 'features.EventEdit.features.details.components.DetailsEdit.errors.wrongSize' }, { requiredWidth: PREFERRED_IMAGE_WIDTH.toString(), requiredHeight: PREFERRED_IMAGE_HEIGHT.toString(), yourWidth: image.width.toString(), yourHeight: image.height.toString() })
							dispatch(ActionCreators.imgUploadFailure({ errors: [ errorMessage ] }))


						} else {
							const xhr = new XMLHttpRequest()
							xhr.open('POST', response_init.url)
							xhr.send(formData)

							xhr.onload = () => {
								if (xhr.readyState === 4) {
									if (xhr.status >= 200 && xhr.status < 300) {
										handleChange({ target: { name: 'image_id', value: response_init.image_id } })
										handleChange({ target: {
											name: 'images',
											value: [{ url: files[0].preview, width: PREFERRED_IMAGE_WIDTH, height: PREFERRED_IMAGE_HEIGHT }]
										} })
										if (event.item.id) {
											dispatch(ActionCreators.update(Object.assign({}, event.item, { image_id: response_init.image_id })))
										}
									} else {
														// valid, non-2XX response // console.error(xhr.statusText);
									}
								}
							}
							xhr.onerror = () => {
                // network error // console.error(xhr.statusText);
							}
						}
					}

					image.src = loadEvent.target.result
					if (image.width === 0) {
						image.onload = handleLoad
					} else {
						handleLoad()
					}
				}
				reader.readAsDataURL(files[0])
			})
		} else {
			// invalid file type
			const fileTypeError = intl.formatMessage({ id: 'features.EventEdit.features.details.components.DetailsEdit.errors.wrongType' })
			dispatch(ActionCreators.imgUploadFailure({ errors: [fileTypeError] }))
		}
	}

	removeImage() {
		const { dispatch, handleChange, event } = this.props
		handleChange({ target: { name: 'image_id', value: null } })
		handleChange({ target: { name: 'images', value: null } })
		if (event.item.id) {
			dispatch(ActionCreators.update(Object.assign({}, event.item, { image_id: null })))
		}
	}

	render() {
		const { handleChange, handleNext, event, intl } = this.props

		let image
		const image_error = (
      typeof event.errors.fields.image !== 'undefined'
        && Array.isArray(event.errors.fields.image)
        && event.errors.fields.image.length > 0
    ) ? <small className="error">{event.errors.fields.image[0]}</small> : null
		if (event.item.images) {
			image = (<Row>
				<div className="columns medium-10 large-8 medium-offset-1 large-offset-2 event-image">
					<Img images={event.item.images} width={PREFERRED_IMAGE_WIDTH} height={PREFERRED_IMAGE_HEIGHT} />
				</div>
				<div className="columns medium-1 large-2">
					<Dropzone className='hollow-button green' onDrop={::this.onDrop} multiple={false}><FormattedMessage id="features.EventEdit.features.details.components.DetailsEdit.changeImage" /></Dropzone>
					<p className='image-drop-manual-reqs' />
					<a tabIndex={0} className='remove' onClick={::this.removeImage}>
						<FormattedMessage id="features.EventEdit.features.details.components.DetailsEdit.removeImage" />
					</a>
				</div>
			</Row>)
		} else {
			image = (<Row>
				<div className="columns medium-10 large-8 medium-offset-1 large-offset-2">
					<div>
						<Dropzone ref='dropzone' onDrop={::this.onDrop} multiple={false} className='image-drop-zone' activeClassName='active' >
							<div className='instructions'>
								<FormattedMessage id="features.EventEdit.features.details.components.DetailsEdit.prompt" /><br />
								<FormattedMessage id="features.EventEdit.features.details.components.DetailsEdit.onlyJpg" /><br />
								<FormattedMessage tagName="b" id="features.EventEdit.features.details.components.DetailsEdit.sizePrompt" values={{ requiredWidth: PREFERRED_IMAGE_WIDTH, requiredHeight: PREFERRED_IMAGE_HEIGHT }} /><br /><br />
							</div>
						</Dropzone>
					</div>
					{image_error}
				</div>
				<div className="columns medium-1 large-2">
					<Dropzone className='hollow-button green' onDrop={::this.onDrop} multiple={false}><FormattedMessage id="features.EventEdit.features.content.components.ContentTypeImage.select" /></Dropzone>
					<p className='image-drop-manual-reqs'>
						<FormattedMessage id="features.EventEdit.features.details.components.DetailsEdit.sizePrompt2" values={{ requiredWidth: PREFERRED_IMAGE_WIDTH, requiredHeight: PREFERRED_IMAGE_HEIGHT }} />
					</p>
				</div>
			</Row>)
		}

		return (
			<form className="event-edit-details-form">
				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<ErrorMessage hasError={Boolean(event.api_errors)} errors={event.api_errors} />
						<FormField id="inputEventName" disabled={!event.rules.details.canEdit} InputType={Input} size='large' placeholder={intl.formatMessage({ id: 'features.EventEdit.features.details.components.DetailsEdit.eventName' })} name='title' onChange={handleChange} value={event.item.title} errors={event.errors.fields.title} />
					</div>
				</Row>

				{image}

				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<FormField disabled={!event.rules.details.canEdit} InputType={Input} size='medium' placeholder={intl.formatMessage({ id: 'features.EventEdit.features.details.components.DetailsEdit.org' })} name="org_name" onChange={handleChange} value={event.item.org_name} errors={event.errors.fields.org_name} />
					</div>
				</Row>

				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<FormField disabled={!event.rules.details.canEdit} InputType={Textarea} placeholder={intl.formatMessage({ id: 'features.EventEdit.features.details.components.DetailsEdit.desc' })} name="description" onChange={handleChange} value={event.item.description} errors={event.errors.fields.description} />
					</div>
				</Row>

				<Row>
					<Column s='medium-12' a='right'>
						<a tabIndex={0} disabled={event.errors.hasError} onClick={handleNext}><FormattedHTMLMessage id="features.EventEdit.features.details.components.DetailsEdit.next" /></a>
					</Column>
				</Row>
			</form>
		)
	}

}

DetailsEdit.propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleNext: PropTypes.func.isRequired,
	event: PropTypes.object.isRequired,
	intl: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired
}

export default DetailsEdit
