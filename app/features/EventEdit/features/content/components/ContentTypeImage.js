import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Textarea from '../../../../../../app/components/Textarea'
import Input from '../../../../../../app/components/Input'
import Image from '../../../../../../app/components/Image'
import Dropzone from 'react-dropzone'
import ActionCreators from '../actions/creators'

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
        const { dispatch, contentIndex, contentData, handleChange } = this.props

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

                var xhr = new XMLHttpRequest()
                xhr.open("POST", response_init.url)
                xhr.send(formData)

                xhr.onload = function (e) {
                    if (xhr.readyState === 4) {
                        if (200 <= xhr.status < 300) {
                            handleChange({target: {name: 'image_id', value: response_init.image_id}})
                            handleChange({target: {
                                name: 'urls',
                                value: [{url: files[0].preview, width: 640, height: 640}]
                            }})
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
            dispatch(ActionCreators.initUploadFailure({index: contentIndex, error: 'Invalid filetype. Must be JPG.'}))
        }
    }

    onOpenClick() {
        this.refs.dropzone.open();
    }

    render() {
        const { contentData, handleChange } = this.props
        var output

        if (contentData.urls) {
            output = <div>
                        <Image images={contentData.urls} width={640} height={640} />
                        <FormField
                            InputType={Input}
                            placeholder="Add caption"
                            name="body"
                            onChange={handleChange}
                            value={contentData.body}
                            errors={contentData.errors} />
                    </div>
        } else {
            output = <div>
                        <Dropzone ref='dropzone' onDrop={::this.onDrop} multiple={false} acceptedFiles=".pdf" className='image-drop-zone' activeClassName='active' >
                            <div className='instructions'>
                                <p>Drag and Drop an Image</p><br/>
                                [JPG only]<br/>
                                We recommend an image width of 1280px or more.<br/><br/>
                                <a className='hollow-button green'>
                                    Select Image
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
