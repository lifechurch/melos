import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import Row from '../../../../../../app/components/Row'

class ImageDrop extends Component {
	constructor(props) {
		super(props)
		this.state = { files: null };
	}

	onDrop(files) {
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
						<Dropzone ref='dropzone' onDrop={this.onDrop} className='image-drop-zone' activeClassName='active' >
							<div className='instructions'>Drag and Drop an Event Image<br/>JPG, PNG, GIF</div>
						</Dropzone>
						{this.state.files ? <div>
							<h2>Uploading {files.length} files...</h2>
							<div>this.state.files.map((file) => <img src={file.preview} />)</div>
						</div> : null}
					</div>					
				</div>
				<div className="columns medium-1 large-2">
					<a className='hollow-button green' onClick={this.onOpenClick}>
						Select Image
					</a>
					<p className='image-drop-manual-reqs'>
						Ideally your image dimensions should be 1200 x 600 pixels, but don’t worry if it isn’t; we’ll make it work.
					</p>
				</div>
			</Row>
		)
	}
}

export default ImageDrop