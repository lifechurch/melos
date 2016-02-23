import React, { Component, PropTypes } from 'react'
import FormField from '../../../../../../app/components/FormField'
import Textarea from '../../../../../../app/components/Textarea'
import Input from '../../../../../../app/components/Input'
import Dropzone from 'react-dropzone'
import ActionCreators from '../actions/creators'

class ContentTypeImage extends Component {
    constructor(props) {
        super(props)
        this.state = { files: null };
        // prevent drag and drop from replacing the page when image is dropped outside of dropzone
        window.addEventListener("dragover",function(e){
          e = e || event;
          e.preventDefault();
        },false);
        window.addEventListener("drop",function(e){
          e = e || event;
          e.preventDefault();
        },false);
    }

    onDrop(files) {
        const { dispatch ,contentIndex, contentData } = this.props;
        if (files[0].type === "image/jpeg" || files[0].type === "image/jpg") {
            dispatch(ActionCreators.initUpload({index: contentIndex}));

            this.setState({
                files: files
            })
        } else {
            // invalid file type
        }
        //console.log(this.props)
        // console.log('upload file: ', files);
    }

    onOpenClick() {
        this.refs.dropzone.open();
    }

    render() {
        const { contentData, handleChange } = this.props
        var output

        if (this.state.files) {
           output = <div>{this.state.files.map((file) => <img src={file.preview} />)}</div>
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
            <div className="form-body-block white">
                    {output}
                    <div>
                        <p>image_id: {contentData.image_id}</p>
                        <p>body: {contentData.body}</p>
                        <p>url: {contentData.url}</p>
                        <FormField
                            InputType={Input}
                            placeholder="Add caption"
                            name="body"
                            onChange={handleChange}
                            value={contentData.body}
                            errors={contentData.errors} />

                        <FormField
                            InputType={Input}
                            placeholder="Image id"
                            name="image_id"
                            onChange={handleChange}
                            value={contentData.image_id}
                            errors={contentData.errors} />
                    </div>
            </div>
        )
    }
}

ContentTypeImage.propTypes = {

}

export default ContentTypeImage
