import React from 'react';
import { shallow } from 'enzyme';

import User from '../User';


const requiredProps = {
	src: 'https://robert-parker-content-prod.s3.amazonaws.com/media/image/2016/10/24/972edf06c5904827acb797520519b35b_RossoPSalumi.jpg',
	width: 50,
}

describe('Component: <User />', () => {
	it('renders without blowing up!', () => {
		const wrapper = shallow(<User {...requiredProps} />)
		expect(wrapper.length).toBe(1)
	})
})
