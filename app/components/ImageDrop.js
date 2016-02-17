import React, { Component, PropTypes } from 'react'
import Dropzone from 'react-dropzone'
import Row from './Row'

class ImageDrop extends Component {
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

    onOpenClick() {
        this.refs.dropzone.open();
    }

    render() {
        const { children } = this.props
        return (
            <Row>
                <div className="columns medium-10 large-8 medium-offset-1 large-offset-2">
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
                <div className="columns medium-1 large-2">
                    <a className='hollow-button green' onClick={::this.onOpenClick}>
                        Select Image
                    </a>
                    <p className='image-drop-manual-reqs'>
                        {this.props.instruction}
                    </p>
                </div>
            </Row>
        )
    }
}

ImageDrop.propTypes = {
    instruction: PropTypes.string
}

export default ImageDrop