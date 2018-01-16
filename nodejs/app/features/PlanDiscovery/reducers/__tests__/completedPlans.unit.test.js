import reducer from '../completedPlans'
import * as types from '../../actions/constants'

describe('Reducer: completedPlans', () => {
	it('should return empty state on failure', () => {
		expect(
			reducer([], {
				type: types.completedFailure,
			})
		).toEqual(
			[]
		)
	})
})
