const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const Canvas = require('canvas');
const canvg = require('canvg');
const Promise = require('bluebird');
const request = require('request');
const api = require('@youversion/js-api');
const getLocale = require('./app/lib/langUtils').getLocale;

const Image = Canvas.Image;
const Users = api.getClient('users');
const Moments = api.getClient('moments');
const router = express.Router();
const displayFont = 'Arial Unicode MS';
const lengthyStringLocales = ['ar', 'vi', 'el']

global.Intl = require('intl');

const Snapshot2018 = require('./snapshot-image-2018').Snapshot
const Snapshot2017 = require('./snapshot-image-2017').Snapshot

// Optimization for readFile
// Load logos upon server startup and apply them as needed at request time
// instead of reading the file on each request

const appLogos = {};
const appLogoSizes = [48, 120, 200, 512];

appLogoSizes.forEach((size) => {
	fs.readFile(`${__dirname}/images/BibleAppLogo-${size}.png`, (err, logo) => {
		appLogos[size] = logo;
	})
});

const DefaultMomentData = {
	plan_completions: 0,
	highlights: 0,
	notes: 0,
	images: 19,
	badges: 0,
	bookmarks: 0,
	friendships: 0,
	days_in_app: 111,
	perfect_weeks: 2
}


function getLogo(graphicSize) {
	switch (true) {
		case graphicSize <= 500:
			return appLogos[48]

		case graphicSize <= 1500:
			return appLogos[120]

		case graphicSize <= 2500:
			return appLogos[200]

		case graphicSize <= 4000:
			return appLogos[512]

		default:
			return appLogos[512]
	}
}

function cleanLocale(locale) {
	return locale.split(/[\-_]+/).slice(0, 2).join('-')
}

class AvatarImage {

	// Ex user data:
	// { website: null,
	//  username: 'MichaelMartin@Awesome',
	//  first_name: 'Michael',
	//  last_name: 'Martin@Awesome',
	//  name: 'Michael Martin@Awesome',
	//  has_avatar: false,
	//  bio: null,
	//  user_avatar_url:
	//   { px_128x128: '//s3.amazonaws.com/static-youversionapidev-com/users/images/54a395cc0a002c10577dea1c28a004cb_128x128.png',
	//     px_24x24: '//s3.amazonaws.com/static-youversionapidev-com/users/images/54a395cc0a002c10577dea1c28a004cb_24x24.png',
	//     px_48x48: '//s3.amazonaws.com/static-youversionapidev-com/users/images/54a395cc0a002c10577dea1c28a004cb_48x48.png',
	//     px_512x512: '//s3.amazonaws.com/static-youversionapidev-com/users/images/54a395cc0a002c10577dea1c28a004cb_512x512.png' },
	//  created_dt: '2017-06-27T14:28:43.284699+00:00',
	// ...
	//  cacheLifetime: 604800 }

	constructor(userData) {
		this.userData = userData;
	}

	get graphicSize() { return this._graphicSize; }
	set graphicSize(s) { this._graphicSize = s; }


	hasAvatar() {
		return this.userData.has_avatar;
	}

	isDefault() {
		return this.userData.default === true;
	}

	initials() {
		let firstInitial, lastInitial;
		if (this.userData.first_name) {
			firstInitial = this.userData.first_name.charAt(0);
		}
		if (this.userData.last_name) {
			lastInitial = this.userData.last_name.charAt(0);
		}

		return `${firstInitial}${lastInitial}`;
	}
	// Pass image buffer data via callback
	load(cb) {
		const data = [];
		if (this.hasAvatar()) {
			const url = `http:${this.userData.user_avatar_url.px_512x512}`

			request.get(url)
			.on('response', (response) => {
				response.on('data', (chunk) => {
					data.push(chunk);
				});
				response.on('end', () => {
					cb(Buffer.concat(data));
				});
			});

		} else if (this.isDefault()) {
			const svgString = '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50.09 50.03"><defs><style>.cls-1{fill:#f2f2f2;}</style></defs><title>me</title><path class="cls-1" d="M24.87,48.86a24,24,0,1,1,24-24A24,24,0,0,1,24.87,48.86Z"/><path d="M24.83,14.91a4.4,4.4,0,0,1,5.1,5l-.38,2.56a4.13,4.13,0,0,1-8.14,0L21,19.88A4.4,4.4,0,0,1,24.83,14.91ZM16.05,31.57q1.14-3.71,9.32-3.71t9.32,3.71a1,1,0,0,1-1,1.29H17a1,1,0,0,1-1-1.29Z"/><path class="cls-1" d="M24.87.86a24,24,0,1,0,24,24A24,24,0,0,0,24.87.86Zm0,14a4.4,4.4,0,0,1,5.1,5l-.38,2.56a4.13,4.13,0,0,1-8.14,0L21,19.88A4.4,4.4,0,0,1,24.83,14.91ZM34,32.82a1,1,0,0,1-.29,0H17a1,1,0,0,1-1-1.29q1.14-3.71,9.32-3.71t9.32,3.71A1,1,0,0,1,34,32.82Z"/><path d="M21.41,22.44a4.13,4.13,0,0,0,8.14,0l.38-2.56a4.48,4.48,0,1,0-8.91,0Z"/><path d="M25.37,27.86q-8.18,0-9.32,3.71a1,1,0,0,0,1,1.29H33.73a1,1,0,0,0,1-1.29Q33.55,27.86,25.37,27.86Z"/></svg>';
			const w = this.graphicSize * 0.30;
			const h = this.graphicSize * 0.30;
			const canvas = new Canvas(w, h);

			canvg(canvas, svgString, { ignoreMouse: true, ignoreAnimation: true, ImageClass: Image });
			cb(canvas.toBuffer());

		} else {
			cb(this.renderInitials().toBuffer());
		}
	}

	renderInitials() {
		const canvas = new Canvas(512, 512); // same size as large avatar
		const ctx = canvas.getContext('2d');

		const bgColor = '#f2f2f2';
		const fontColor = '#1e7170';
		const fontSize = 250;
		const startAngle = 0;
		const endAngle = Math.PI * 2;

		ctx.fillStyle = bgColor;
		ctx.beginPath();
		ctx.arc(256, 256, 256, startAngle, endAngle, true);
		ctx.closePath();
		ctx.fill();

		ctx.textAlign = 'center';
		ctx.fillStyle = fontColor;
		ctx.font = `${fontSize}px ${displayFont}`;
		ctx.fillText(this.initials(), 250, (256 + (fontSize / 2.5)));

		return canvas;
	}

}

function isHashValid(hashToVerify, userId) {
	const secret = process.env.YIR_SHA1_SECRET_KEY || 'SECRET';
	const algo = 'sha1';
	const hmac = crypto.createHmac(algo, secret);
	hmac.update(userId);
	return hashToVerify === hmac.digest('hex');
}

function isSizeValid(size) {
	if (size < 100) return false;
	if (size > 4000) return false;
	if (size % 100 !== 0) return false;

	return true;
}

function isYearValid(year) {
	return year === '2017' || year === '2018'
}

router.get('/snapshot/default/:size', (req, res) => {
	const imageSize = parseInt(req.params.size, 10);
	const logo = getLogo(imageSize);
	const locale = cleanLocale(req.query.locale || 'en-US');
	const avatar = new AvatarImage({ default: true });

	if (!isSizeValid(imageSize)) {
		res.status(404).send('Not found');
	}

	const graphic = new Snapshot2018(imageSize, getLocale({
		localeFromUrl: locale, localeFromCookie: null, localeFromUser: null, acceptLangHeader: null
	}));

	graphic.appLogo = logo;
	graphic.locale = locale;

	graphic.momentData = {}; // blank data
	avatar.graphicSize = imageSize;
	avatar.load((data) => {
		graphic.avatarData = data;
		graphic.render();
		res.setHeader('Content-Type', 'image/png');
		graphic.canvas.pngStream().pipe(res);
	})

})


// https://nodejs.bible.com/{language-tag}/year-in-review/{user-id-hash}/{size}
router.get('/snapshot/:user_id_hash/:user_id/:size', (req, res) => {

	let graphic;
	let fromDate = '2017-01-01';
	let toDate = '2017-12-31';
	const year = req.query.year;
	const userId = req.params.user_id;
	const imageSize = parseInt(req.params.size, 10);
	const logo = getLogo(imageSize);
	const locale = cleanLocale(req.query.locale || 'en-US');
	let avatar;

	if (!isHashValid(req.params.user_id_hash, req.params.user_id)) {
		res.status(404).send('Not found');
		return
	}

	if (!isSizeValid(imageSize)) {
		res.status(404).send('Not found');
		return
	}

	if (!isYearValid(year)) {
		res.status(404).send('Not found');
		return
	}

	switch (year) {
		case '2017':
			graphic = new Snapshot2017(imageSize);
			graphic.localeData = getLocale({
				localeFromUrl: locale, localeFromCookie: null, localeFromUser: null, acceptLangHeader: null
			})
			break;


		case '2018':
			graphic = new Snapshot2018(imageSize, getLocale({
				localeFromUrl: locale, localeFromCookie: null, localeFromUser: null, acceptLangHeader: null
			}));
			fromDate = '2018-01-01';
			toDate = '2018-12-31';
			break;
	}

	graphic.appLogo = logo;
	graphic.locale = locale;


	const userPromise = Users.call('view')
	.setEnvironment(process.env.NODE_ENV)
	.params({ id: userId })
	.get()

	const momentPromise = Moments.call('summary')
	.setEnvironment(process.env.NODE_ENV)
	.params({ user_id: userId, from_date: fromDate, to_date: toDate })
	.get()

	Promise.all([userPromise, momentPromise])
	.then((results) => {
		const userData = results[0];
		const momentData = results[1];

		graphic.momentData = DefaultMomentData //momentData;
		avatar = new AvatarImage(userData);
		avatar.graphicSize = imageSize;
		avatar.load((data) => {
			graphic.avatarData = data;

			graphic.render();
			res.setHeader('Content-Type', 'image/png');
			graphic.canvas.pngStream().pipe(res);
		})
	})
})

module.exports = router;
