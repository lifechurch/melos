import React, { Component } from 'react'


class CarouselSlideImage extends Component {
    render() {
        const { imageComponent, title, id } = this.props
        var titleDiv = {}

        if (title) {
            titleDiv = <h6 className='image-title'>{title}</h6>
        }

        return (
          <div>
            {imageComponent}
            {titleDiv}
          </div>
        );
    }
}

export default CarouselSlideImage
