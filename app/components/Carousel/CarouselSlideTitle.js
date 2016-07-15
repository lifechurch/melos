import React, { Component } from 'react'


class CarouselSlideTitle extends Component {
    render() {
        const { title, id } = this.props

        var classes = 'slide'
        var titleClasses = 'title-padding title-container radius-5'
        return (
          <div className={classes}>
            <div className={titleClasses}>{title}</div>
          </div>
        );
    }
}

export default CarouselSlideTitle
