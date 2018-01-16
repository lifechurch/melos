import React from 'react';
import { shallow } from 'enzyme';

import LazyImage from '../LazyImage';


const requiredProps = { }

describe('Component: <LazyImage />', () => {
	it('renders without blowing up!', () => {
		const wrapper = shallow(<LazyImage {...requiredProps} />)
		expect(wrapper.length).toBe(1)
	})
})
