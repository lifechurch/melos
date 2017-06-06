import React, { Component } from 'react'


class CarouselSlideImage extends Component {
    render() {
        const { children, title, id } = this.props
        var titleDiv = null

        if (title) {
            titleDiv = <div className='slide-title'>{title}</div>
        }

        var classes = ''
        return (
          <div className={classes}>
            <div className='slide-image'>{children}</div>
            {titleDiv}
          </div>
        );
    }
}

export default CarouselSlideImage
