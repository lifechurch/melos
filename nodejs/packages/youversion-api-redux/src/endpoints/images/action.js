import Immutable from 'immutable'
import actionGenerator from '../../generators/action'


const imagesActions = actionGenerator({
	endpoint: 'images',
	version: '3.1',
})

export default imagesActions
