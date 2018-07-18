// media queries **************************************************************
export const small = {
  min: 0,
  max: 37.438
}

export const medium = {
  min: 37.5,
  max: 63.938
}

export const large = {
  min: 64,
  max: 90
}

export const xlarge = {
  min: 90.063,
  max: 120
}

export const xxlarge = {
  min: 120.063,
  max: 99999999
}


export const screen = 'only screen'

export const landscape = `@media ${screen} and (orientation: landscape)`
export const portrait = `@media ${screen} and (orientation: portrait)`

export const smallUp = `@media ${screen}`
export const smallOnly = `@media ${screen} and (max-width: ${small.max}em)`

export const mediumUp = `@media ${screen} and (min-width: ${medium.min}em)`
export const mediumOnly = `@media ${screen} and (min-width: ${medium.min}em) and (max-width: ${medium.max}em)`

export const largeUp = `@media ${screen} and (min-width: ${large.min}em)`
export const largeOnly = `@media ${screen} and (min-width: ${large.min}em) and (max-width: ${large.max}em)`

export const xlargeUp = `@media ${screen} and (min-width: ${xlarge.min}em)`
export const xlargeOnly = `@media ${screen} and (min-width: ${xlarge.min}em) and (max-width: ${xlarge.max}em)`

export const xxlargeUp = `@media ${screen} and (min-width: ${xxlarge.min}em)`
export const xxlargeOnly = `@media ${screen} and (min-width: ${xxlarge.min}em) and (max-width: ${xxlarge.max}em)`
