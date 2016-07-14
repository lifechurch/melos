import React, { Component } from 'react'


class CarouselSlideTitle extends Component {
    render() {
        const { title, id } = this.props


        return (
          <div className='title-slide'>
            <h5 className='title-title'>{title}</h5>
          </div>
        );
    }
}

export default CarouselSlideTitle
