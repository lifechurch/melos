import React, { Component } from 'react'


// class CarouselSlideGradient extends Component {
//     render() {
//     	const { content } = this.props
//     	var style = {}
//         var slideContent = null

//         // configure gradient styling if the carousel has a gradient associated with it
//     	if (content.gradient) {
//     		var colors = []
//     		for(var i = 0; i < content.gradient.colors.length; i++) {
//     			// build color format for linear gradient i.e. #ffff 20%, #efee 50%, ...
//     			colors.push(`#${content.gradient.colors[i][0]} ${content.gradient.colors[i][1] * 100}%`)
//     		}
//     		colors.join(' ,')

//     		style = {
//     			"backgroundImage": `linear-gradient(${content.gradient.angle}deg, ${colors})`
//     		}
//     	}


// 	    return (
// 	      <div id={`${content.id}`} className={`slide-content-${content.display}`} style={style}>

// 	      </div>
// 	    );
//     }
// }



class CarouselSlideGradient extends Component {
    render() {
        const { gradient, title, id } = this.props
        var style = {}
        var slideContent = null

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


        var classes = `slide-content gradient-slide`

        return (
          <div id={`${id}`} className='slide' style={style}>
              <div>
                <h3 className='gradient-title'>{title}</h3>
              </div>
          </div>
        );
    }
}

export default CarouselSlideGradient
