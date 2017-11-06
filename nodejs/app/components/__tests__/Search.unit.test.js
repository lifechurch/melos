import React from 'react';
import { shallow } from 'enzyme';

import Search from '../Search';


const requiredProps = { size: 'medium' }

describe('Component: <Search />', () => {
	it('renders without blowing up!', () => {
		const wrapper = shallow(<Search {...requiredProps} />)
		expect(wrapper.length).toBe(1)
	})
})
