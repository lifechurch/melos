import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import { Link } from 'react-router'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'
import Select from '../../../../../../app/components/Select'
import Textarea from '../../../../../../app/components/Textarea'
import Image from '../../../../../../app/components/Image'
import ErrorMessage from '../../../../../../app/components/ErrorMessage'
import Dropzone from 'react-dropzone'
import ActionCreators from '../actions/creators'


class DetailsEdit extends Component {

    onDrop(files) {
        const { dispatch, event, handleChange } = this.props

        if (files[0].type === "image/jpeg" || files[0].type === "image/jpg") {
            dispatch(ActionCreators.imgUpload({})).then( function(response_init){
                // Upload to S3
                var formData = new FormData()
                formData.append('AWSAccessKeyId', response_init.params['AWSAccessKeyId'])
                formData.append('key', response_init.params['key'])
                formData.append('policy', response_init.params['policy'])
                formData.append('x-amz-storage-class', response_init.params['x-amz-storage-class'])
                formData.append('Signature', response_init.params['signature'])
                formData.append('file', files[0])

                var xhr = new XMLHttpRequest()
                xhr.open("POST", response_init.url)
                xhr.send(formData)

                xhr.onload = function (e) {
                    if (xhr.readyState === 4) {
                        if (200 <= xhr.status < 300) {
                            handleChange({target: {name: 'image_id', value: response_init.image_id}})
                            handleChange({target: {
                                name: 'images',
                                value: [{url: files[0].preview, width: 1280, height: 720}]
                            }})
                            if (event.item.id) {
						        dispatch(ActionCreators.update(Object.assign({}, event.item, {'image_id': response_init.image_id})))
                            }
                        } else {
                            // valid, non-2XX response // console.error(xhr.statusText);
                        }
                    }
                }
                xhr.onerror = function (e) {
                    // network error // console.error(xhr.statusText);
                }

            })
        } else {
            // invalid file type
        }
    }

    removeImage(){
    	const { dispatch, handleChange, event } = this.props
        handleChange({target: {name: 'image_id', value: null}})
        handleChange({target: {name: 'images', value: null}})
        if (event.item.id) {
	        dispatch(ActionCreators.update(Object.assign({}, event.item, {'image_id': null})))
        }
    }

	render() {
		const { handleChange, handleNext, event, params } = this.props

		var image
        if (event.item.images) {
        	image = <Row>
		                <div className="columns medium-10 large-8 medium-offset-1 large-offset-2 event-image">
			                <Image images={event.item.images} width={1280} height={720} />
			            </div>
		                <div className="columns medium-1 large-2">
			                <Dropzone className='hollow-button green' onDrop={::this.onDrop} multiple={false}>Change Image</Dropzone>
		                    <p className='image-drop-manual-reqs'></p>
		                    <a className='remove' onClick={::this.removeImage}>Remove Image</a>
		                </div>
		            </Row>
        } else {
        	image = <Row>
		                <div className="columns medium-10 large-8 medium-offset-1 large-offset-2">
		                    <div>
		                        <Dropzone ref='dropzone' onDrop={::this.onDrop} multiple={false} className='image-drop-zone' activeClassName='active' >
		                            <div className='instructions'>Drag and Drop your JPG</div>
		                        </Dropzone>
		                    </div>
		                </div>
		                <div className="columns medium-1 large-2">
			                <Dropzone className='hollow-button green' onDrop={::this.onDrop} multiple={false}>Select Image</Dropzone>
		                    <p className='image-drop-manual-reqs'>Ideally your image dimensions should be 1280 x 720 pixels, but don’t worry if it isn’t; we’ll make it work.</p>
		                </div>
		            </Row>
        }

		return (
			<form className="event-edit-details-form">
				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<ErrorMessage hasError={Boolean(event.api_errors)} errors={event.api_errors} />
						<FormField disabled={!event.rules.details.canEdit} InputType={Input} size='large' placeholder='Event Name' name='title' onChange={handleChange} value={event.item.title} errors={event.errors.fields.title} />
					</div>
				</Row>

				{image}

				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<FormField disabled={!event.rules.details.canEdit} InputType={Input} size='medium' placeholder="Church Name or Organization" name="org_name" onChange={handleChange} value={event.item.org_name} errors={event.errors.fields.org_name} />
					</div>
				</Row>

				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<FormField disabled={!event.rules.details.canEdit} InputType={Textarea} placeholder="Event Description" name="description" onChange={handleChange} value={event.item.description} errors={event.errors.fields.description} />
					</div>
				</Row>

				<Row>
					<Column s='medium-12' a='right'>
						<a disabled={event.errors.hasError} onClick={handleNext}>Next: Add Location & Times</a>
					</Column>
				</Row>
			</form>
		)
	}

}

DetailsEdit.propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleNext: PropTypes.func.isRequired,
	handleLeave: PropTypes.func.isRequired,
	event: PropTypes.object.isRequired
}

export default DetailsEdit
