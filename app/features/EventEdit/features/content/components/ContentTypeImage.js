import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Textarea from '../../../../../../app/components/Textarea'
import Input from '../../../../../../app/components/Input'
import Dropzone from 'react-dropzone'
import ActionCreators from '../actions/creators'
import { FormattedMessage } from 'react-intl'

const PREFERRED_IMAGE_WIDTH = 640
const PREFERRED_IMAGE_HEIGHT = 640
const PREFERRED_IMAGE_RATIO = PREFERRED_IMAGE_HEIGHT / PREFERRED_IMAGE_WIDTH
const MIN_IMAGE_WIDTH = 640

class ContentTypeImage extends Component {
	constructor(props) {
		super(props)
		this.state = { files: null };
		// prevent drag and drop from replacing the page when image is dropped outside of dropzone
		if (typeof window !== 'undefined') {
			window.addEventListener("dragover",function(e){
			  e = e || event;
			  e.preventDefault();
			},false);
			window.addEventListener("drop",function(e){
			  e = e || event;
			  e.preventDefault();
			},false);
		}
	}

	onDrop(files) {
		const { dispatch, contentIndex, contentData, handleChange, intl } = this.props

		if (files[0].type === "image/jpeg" || files[0].type === "image/jpg") {
			dispatch(ActionCreators.initUpload({index: contentIndex})).then( function(response_init){
				// Upload to S3
				var formData = new FormData()
				formData.append('AWSAccessKeyId', response_init.params['AWSAccessKeyId'])
				formData.append('key', response_init.params['key'])
				formData.append('policy', response_init.params['policy'])
				formData.append('x-amz-storage-class', response_init.params['x-amz-storage-class'])
				formData.append('Signature', response_init.params['signature'])
				formData.append('file', files[0])

				var reader = new FileReader()
				reader.onload = function (loadEvent) {
					var image = new Image()
					image.src = loadEvent.target.result

					if ((PREFERRED_IMAGE_RATIO !== (image.height / image.width)) || (image.width < MIN_IMAGE_WIDTH)) {
						const errorMessage = intl.formatMessage({ id: "features.EventEdit.features.content.components.ContentTypeImage.errors.wrongSize" }, { requiredWidth: PREFERRED_IMAGE_WIDTH.toString(), requiredHeight: PREFERRED_IMAGE_HEIGHT.toString(), yourWidth: image.width.toString(), yourHeight: image.height.toString() })
						dispatch(ActionCreators.initUploadFailure({index: contentIndex, error: errorMessage}))
						return

					} else {
						var xhr = new XMLHttpRequest()
						xhr.open("POST", response_init.url)
						xhr.send(formData)

						xhr.onload = function (e) {
							if (xhr.readyState === 4) {
								if (200 <= xhr.status < 300) {
									handleChange({target: {name: 'image_id', value: response_init.image_id}})
									handleChange({target: {
										name: 'urls',
										value: [{url: files[0].preview, width: PREFERRED_IMAGE_WIDTH, height: PREFERRED_IMAGE_HEIGHT}]
									}})
								} else {
									// valid, non-2XX response // console.error(xhr.statusText);
								}
							}
						}
						xhr.onerror = function (e) {
							// network error // console.error(xhr.statusText);
						}
					}
				}
				reader.readAsDataURL(files[0])
			})

		} else {
			// invalid file type
			dispatch(ActionCreators.initUploadFailure({index: contentIndex, error: intl.formatMessage({ id: "features.EventEdit.features.content.components.ContentTypeImage.errors.wrongType" }) }) )
		}
	}

	onOpenClick() {
		this.refs.dropzone.open();
	}

	render() {
		const { contentData, handleChange, intl } = this.props
		var output

		var images = []
		if (contentData.urls) {
			images = contentData.urls.filter((i) => { if (i.width==PREFERRED_IMAGE_WIDTH && i.height==PREFERRED_IMAGE_HEIGHT) { return true } })
		}
		var image_url = images.length ? images[0].url : false

		if (image_url) {
			output = <div>
						<div className="img-box">
							<div className="img-bkg" style={{backgroundImage: "url(" + image_url + ")"}} />
						</div>
						<FormField
							InputType={Input}
							placeholder={intl.formatMessage({id:"features.EventEdit.features.content.components.ContentTypeImage.caption"})}
							name="body"
							onChange={handleChange}
							value={contentData.body}
							errors={contentData.errors} />
					</div>
		} else {
			output = <div>
						<Dropzone ref='dropzone' onDrop={::this.onDrop} multiple={false} acceptedFiles=".pdf" className='image-drop-zone' activeClassName='active' >
							<div className='instructions'>
								<FormattedMessage id="features.EventEdit.features.content.components.ContentTypeImage.prompt" tagName="p" /><br/>
								<FormattedMessage id="features.EventEdit.features.content.components.ContentTypeImage.onlyJpg" /><br/><br/>
								<FormattedMessage id="features.EventEdit.features.content.components.ContentTypeImage.sizePrompt" values={{requiredHeight: PREFERRED_IMAGE_HEIGHT.toString(), requiredWidth: PREFERRED_IMAGE_WIDTH.toString() }} /><br/><br/>
								<a className='hollow-button green'>
									<FormattedMessage id="features.EventEdit.features.content.components.ContentTypeImage.select" />
								</a>
							</div>
						</Dropzone>
					</div>
		}
		return (
			<div>
				<div className="form-body-block white">{output}</div>
			</div>
		)
	}
}

ContentTypeImage.propTypes = {

}

export default ContentTypeImage
