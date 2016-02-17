import React, { Component, PropTypes } from 'react'
import ImageDrop from '../../../../../../app/components/ImageDrop'

class ContentTypeImage extends Component {
    render() {
        const { contentData, handleChange } = this.props
        return (
            <ImageDrop instruction=''/>
        )
    }
}

ContentTypeImage.propTypes = {

}

export default ContentTypeImage
