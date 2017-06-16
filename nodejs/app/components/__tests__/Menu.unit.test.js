import React from 'react';
import { shallow } from 'enzyme';

import Menu from '../Menu';


const children = (
	<ul>
		<li>
			one
		</li>
		<li>
			two
		</li>
		<li>
			three
		</li>
	</ul>
)
const requiredProps = {
	children,
}

describe('Component: <Menu />', () => {
	it('renders without blowing up!', () => {
		const wrapper = shallow(<Menu {...requiredProps} />);
		expect(wrapper.length).toBe(1)
	})
	it('optionally renders a header')
	it('optionally renders a prop menu class on the ul')
	it('optionally renders a footer')
	it('renders a list of items as children')
})
