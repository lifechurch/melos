import express from 'express'
import bodyParser from 'body-parser'
import { getClient } from '@youversion/js-api'

const po2json = require('po2json');

const router = express.Router()
const jsonParser = bodyParser.json()


/**
 * call the localization endpoint from the server
 * @param  {[object]} params [description]
 * @return {[type]}        [description]
 */
function localizationClientCall(noun, params) {
	const extension = noun === 'items'
		? 'po'
		: 'json'
	return getClient('localization')
		.call(noun)
		.setVersion('3.1')
		.setExtension(extension)
		.params(params)
		.setEnvironment(process.env.NODE_ENV)
		.get()
}

export function configuration(params = {}) {
	return localizationClientCall('configuration', params)
}

/**
 * localization.items get
 * @param  {Object} [params={}] [{ language_tag }]
 * @return {[type]}             [description]
 */
export function items(params = { language_tag: 'en' }) {
	return localizationClientCall('items', params)
}

export function poToJson(data) {
	return po2json.parse(data, { format: 'mf' })
}

router.get('/configuration', jsonParser, (req, res) => {
	configuration().then((config) => {
		res.send(config)
	}, (err) => {
		res.send(err)
	})
})

router.get('/items', jsonParser, (req, res) => {
	items(req.query).then((config) => {
		// convert po to json
		res.send(poToJson(config))
	}, (err) => {
		res.send(err)
	})
})


export default router
