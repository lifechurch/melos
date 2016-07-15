import React, { Component } from 'react'


class CarouselSlideGradient extends Component {
    render() {
        const { gradient, title, id } = this.props
        var style = {}

        if (gradient) {
            // configure gradient styling if the carousel has a gradient associated with it
            var colors = []
            for(var i = 0; i < gradient.colors.length; i++) {
                // build color format for linear gradient i.e. #ffff 20%, #efee 50%, ...
                colors.push(`#${gradient.colors[i][0]} ${gradient.colors[i][1] * 100}%`)
            }
            colors.join(' ,')

            style = {
                "backgroundImage": `linear-gradient(${gradient.angle}deg, ${colors})`
            }
        } else {
            style = {
                "backgroundImage": `linear-gradient(45deg, #ffff 0%, #eeee 50%, #aaaa 100%)`
            }
        }


        var classes = 'slide vertical-center horizontal-center'
        var titleClasses = 'gradient-title-container title-padding'
        return (
          <div className={classes} style={style}>
            <div className={titleClasses}>{title}</div>
          </div>
        );
    }
}

export default CarouselSlideGradient
