import React from 'react'
import { shallow } from 'enzyme'
import { Img } from 'glamorous'
import LazyImage from '../'

const requiredProps = { }
// shallow render the component with the required props by default
// this wrapper is used to make assertions
const renderWrapper = (props = requiredProps) => {
  return shallow(<LazyImage {...props} />)
}
// set up default wrapper with ability to overwrite when testing specific props
// above and beyone the requiredProps
let wrapper = renderWrapper()
/**
 * Describe the component with assertions
 */
describe('Component: <LazyImage />', () => {
  it('renders without blowing up!', () => {
    expect(wrapper.length).toBe(1)
  })
  it('renders an img component', () => {
    expect(wrapper.find(Img).length).toBe(1)
  })
  it('renders an img when src is passed', () => {
    const pizzaSrc = 'http://medictto.com/admin/data/images/slider/Img_4aa01cec0723640a911366bfadf7f550_1504796536.jpg'
    wrapper = renderWrapper({ src: pizzaSrc })
    expect(wrapper.instance().props.src).toBe(pizzaSrc)
  })
})
