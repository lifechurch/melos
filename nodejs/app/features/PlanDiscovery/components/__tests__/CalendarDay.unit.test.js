import React from 'react';
import { shallow } from 'enzyme';

import CalendarDay from '../CalendarDay';


const requiredProps = { date: '1' }

describe('Component: <CalendarDay />', () => {
	it('renders without blowing up!', () => {
		const wrapper = shallow(<CalendarDay {...requiredProps} />)
		expect(wrapper.length).toBe(1)
	})
	it('optionally adds a custom class')
	it('renders a link around the day if a link is passed')
	it('calls a click handler when clicked if one is passed')
	it('applies a disabled class and does not call the click handler if disabled prop is true')
})
