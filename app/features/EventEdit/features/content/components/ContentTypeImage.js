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
        // window.addEventListener("dragover",function(e){
        //   e = e || event;
        //   e.preventDefault();
        // },false);
        // window.addEventListener("drop",function(e){
        //   e = e || event;
        //   e.preventDefault();
        // },false);
    }

    onDrop(files) {
        console.log('upload file: ', files);
        this.setState({
            files: files
        });
    }

    initImageUpload() {
        const { dispatch ,contentIndex } = this.props;
        dispatch(ActionCreators.initUpload({index: contentIndex}));
    }

    onOpenClick() {
        this.refs.dropzone.open();
    }

    render() {
        const { contentData, handleChange } = this.props
        return (
            <div className="form-body-block white">
                <div className="columns medium-10 large-8 medium-offset-1 large-offset-2">
                <button onClick={::this.initImageUpload}>imageAPICall</button>

                    <div>
                        <Dropzone ref='dropzone' onDrop={this.onDrop} multiple={false} className='image-drop-zone' activeClassName='active' >
                            <div className='instructions'>Drag and Drop your Image<br/>JPG, PNG, GIF</div>
                        </Dropzone>
                        {this.state.files ? <div>
                            <h2>Uploading file...</h2>
                            <div>{this.state.files.map((file) => <img src={file.preview} />)}</div>
                        </div> : null}
                    </div>
                </div>
                <div>
                image_id: {contentData.image_id}<br/>
                body: {contentData.body}<br/>
                url: {contentData.url}<br/>
                </div>
                <div className="columns medium-1 large-2">
                    <a className='hollow-button green' onClick={::this.onOpenClick}>
                        Select Image
                    </a>
                    <p className='image-drop-manual-reqs'>
                        {this.props.instruction}
                    </p>
                </div>
                <FormField
                    InputType={Input}
                    placeholder="body"
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
        )
    }
}

ContentTypeImage.propTypes = {

}

export default ContentTypeImage
