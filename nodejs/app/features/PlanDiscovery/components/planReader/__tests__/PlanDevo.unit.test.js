import React from 'react';
import { shallow } from 'enzyme';

import PlanDevo from '../PlanDevo';



const requiredProps = { devoContent: 'Content' }

describe('<PlanDevo />', () => {
	it('renders without blowing up!', () => {
		const wrapper = shallow(<PlanDevo {...requiredProps} />);
		expect(wrapper.length).toBe(1)
	});
});
