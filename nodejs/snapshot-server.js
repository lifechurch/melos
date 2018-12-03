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
	images: 0,
	badges: 0,
	bookmarks: 0,
	friendships: 0,
	days_in_app: 0,
	perfect_weeks: 0
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

// class Icon {
// 	constructor(svgString, w, h, data = null) {
// 		this.svgString = svgString;
// 		this.width = w;
// 		this.height = h;
// 		this.canvas = new Canvas(w, h);
// 		this.image = new Image();
// 		this.data = data;
// 		this.render();
// 	}

// 	render() {
// 		canvg(this.canvas, this.svgString, { ignoreMouse: true, ignoreAnimation: true, ImageClass: Image });
// 		this.image.src = this.canvas.toBuffer();
// 	}
// }

// class Snapshot {
// 	constructor(size) {
// 		this.size = size;
// 		this.width = size;
// 		this.height = size;
// 		this.fontSize = this.relativeFontSize();
// 		this.fontStyle = `${this.fontSize}px ${displayFont}`;

// 		this._canvas = new Canvas(size, size);
// 		this.ctx = this._canvas.getContext('2d');

// 		this.colors = {
// 			red: '#ec4e48',
// 			aqua: '#37a5ac',
// 			grey: '#868686',
// 			green: '#066261',
// 			yellow: '#eccf2d',
// 			lightGrey: '#f2f2f2'
// 		}

// 		this.icons = {
// 			checkmark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 11"><path fill="#FFF" fill-rule="evenodd" d="M4.544 6.685l-2.24-1.777a.731.731 0 0 0-.968.053l-.466.46a.731.731 0 0 0-.053.98l3.188 3.935a.731.731 0 0 0 1.112.03l7.53-8.36a.731.731 0 0 0-.03-1.01l-.28-.277A.731.731 0 0 0 11.34.69L4.544 6.685z" opacity=".9"/></svg>',
// 			highlighter: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 13"><path fill="#FFF" fill-rule="evenodd" d="M3.332 8.768l2.172 2.171-1.702 1.702a.366.366 0 0 1-.26.107l-1.245-.002a.366.366 0 0 1-.257-.107l-1.032-1.03a.366.366 0 0 1 0-.516l2.324-2.325zm.455-1.41l6.31-6.309a.731.731 0 0 1 1.034 0l2.068 2.068a.731.731 0 0 1 0 1.035l-6.31 6.31a.731.731 0 0 1-1.034 0l-2.068-2.07a.731.731 0 0 1 0-1.033z" opacity=".9"/></svg>',
// 			streak: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 14"><path fill="#FFF" fill-rule="nonzero" d="M6.597 4.882l-1.527.41a.21.21 0 0 1-.263-.177L4.17.158a.21.21 0 0 0-.406-.044l-3.17 8.93a.21.21 0 0 0 .252.274l1.381-.37a.21.21 0 0 1 .264.18l.499 4.66a.21.21 0 0 0 .404.056l3.453-8.68a.21.21 0 0 0-.25-.282z"/></svg>',
// 			note: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 10"><path fill="#FFF" fill-rule="evenodd" d="M6.262 9.233V7.017H8.48v-.554H5.986a.278.278 0 0 0-.278.277v2.493H1.277a.556.556 0 0 1-.556-.555V.922c0-.307.249-.555.556-.555h6.646c.307 0 .556.248.556.555v6.095L6.265 9.233h-.003zM7.371 3.97a.277.277 0 0 0-.277-.277H2.106a.277.277 0 1 0 0 .554h4.988a.277.277 0 0 0 .277-.277zm0-1.663a.277.277 0 0 0-.277-.277H2.106a.277.277 0 1 0 0 .554h4.988a.277.277 0 0 0 .277-.277z" opacity=".9"/></svg>',
// 			verseImage: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 15"><path fill="#FFF" fill-rule="evenodd" d="M8.546 8.793L6.668 5.337a.417.417 0 0 0-.733 0l-3.634 6.686a.417.417 0 0 0 .366.615h9.3a.417.417 0 0 0 .356-.634L9.806 7.896a.417.417 0 0 0-.71 0l-.55.897zM1.41.925H13.04c.46 0 .834.373.834.834V13.39c0 .46-.373.834-.834.834H1.41a.834.834 0 0 1-.834-.834V1.76c0-.46.373-.834.834-.834zm9.557 4.156a1.247 1.247 0 1 0 0-2.494 1.247 1.247 0 0 0 0 2.494z"/></svg>',
// 			bookmark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9"><path fill="#FFF" fill-rule="evenodd" d="M1.335.283h6.53c.345 0 .625.28.625.626v7.726a.313.313 0 0 1-.468.271L4.929 7.13a.625.625 0 0 0-.62-.001l-3.132 1.78a.313.313 0 0 1-.467-.271V.908c0-.345.28-.625.625-.625z" opacity=".9"/></svg>',
// 			friends: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9"><path fill="#FFF" fill-rule="evenodd" d="M8.642 4.014S8.405 5.44 6.829 5.42a1.733 1.733 0 0 1-1.782-1.415l-.155-1.048S4.707 1.135 6.386.891c0 0 .35-.051.762 0 .462.057 1.37.152 1.617 1.414 0 0 .052.326.031.62-.052.758-.154 1.09-.154 1.09zm-4.534.983s-.16 1.035-1.223 1.02C1.823 6.002 1.684 4.99 1.684 4.99l-.104-.762s-.125-1.323 1.007-1.5c0 0 .236-.038.514 0 .31.04.924.11 1.09 1.027 0 0 .035.237.021.451-.036.55-.104.792-.104.792zm2.671.884c2.182 0 3.48.682 3.894 2.046a.556.556 0 0 1-.531.718l-6.626.003a.556.556 0 0 1-.54-.687c.338-1.387 1.606-2.08 3.803-2.08zM2.705 8.65H.88a.556.556 0 0 1-.52-.753C.664 7.099 1.56 6.7 3.054 6.7c-.59.598-.902 1.473-.348 1.949z" opacity=".9"/></svg>',
// 			badges: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.55 16.57"><defs><style>.cls-1{fill:none;}.cls-2{fill:#fff;}</style></defs><title>badge</title><path class="cls-1" d="M5.24,7.2H5.12a4,4,0,1,0,.12,0Zm.06,6.93a2.95,2.95,0,1,1,2.95-2.95A2.95,2.95,0,0,1,5.3,14.13Z"/><path class="cls-2" d="M6.6,6.41,9.83,4.53a1,1,0,0,0,.48-.94c0-.63,0-1.83,0-2.47S9.76.18,9.19.18h-8c-.55,0-.87.64-.87,1s0,2.47,0,2.47a1,1,0,0,0,.45.87l3.1,1.82.1.07a5,5,0,1,0,2.63,0ZM5.24,15.23a4,4,0,0,1-.12-8h.12a4,4,0,1,1,0,8Z"/><circle class="cls-2" cx="5.3" cy="11.19" r="2.95"/></svg>'
// 		}

// 		this.coordinates = {
// 			plans: {
// 				x: this.relativeX(0.285),
// 				y: this.relativeY(0.42),
// 				relX: 0.285,
// 				relY: 0.42,
// 				iconYShift: 0.025
// 			},
// 			highlights: {
// 				x: this.relativeX(0.47),
// 				y: this.relativeY(0.28),
// 				relX: 0.47,
// 				relY: 0.28,
// 				iconYShift: 0.035
// 			},
// 			friends: {
// 				x: this.relativeX(0.65),
// 				y: this.relativeY(0.365),
// 				relX: 0.65,
// 				relY: 0.365,
// 				iconYShift: 0.025
// 			},
// 			notes: {
// 				x: this.relativeX(0.712),
// 				y: this.relativeY(0.527),
// 				relX: 0.712,
// 				relY: 0.527,
// 				iconYShift: 0.02
// 			},
// 			verseImgs: {
// 				x: this.relativeX(0.64),
// 				y: this.relativeY(0.725),
// 				relX: 0.64,
// 				relY: 0.725,
// 				iconYShift: 0.03
// 			},
// 			bookmarks: {
// 				x: this.relativeX(0.455),
// 				y: this.relativeY(0.7),
// 				relX: 0.455,
// 				relY: 0.7,
// 				iconYShift: 0.03
// 			},
// 			badges: {
// 				x: this.relativeX(0.305),
// 				y: this.relativeY(0.595),
// 				relX: 0.305,
// 				relY: 0.595,
// 				iconYShift: 0.02
// 			}
// 		}
// 	}

// 	get canvas() { return this._canvas; }

// 	get locale() { return this._locale; }
// 	set locale(l) { this._locale = l; }

// 	get localeData() { return this._localeData; }
// 	set localeData(d) { this._localeData = d; }

// 	get avatarData() { return this._avatarData; }
// 	set avatarData(d) { this._avatarData = d; }

// 	get appLogo() { return this._appLogo; }
// 	set appLogo(l) { this._appLogo = l; }

// 	get momentData() { return this._momentData; }
// 	set momentData(data) {
// 		const defaults = {
// 			badges: 0,
// 			bookmarks: 0,
// 			friendships: 0,
// 			highlights: 0,
// 			images: 0,
// 			notes: 0,
// 			plan_completions: 0,
// 			plan_segment_completions: 0,
// 			plan_subscriptions: 0
// 		}
// 		this._momentData = Object.assign({}, defaults, data);
// 	}

// 	render() {
// 		const ctx = this.ctx;


// 		ctx.antialias = 'subpixel';
// 		ctx.patternQuality = 'bilinear';
// 		ctx.filter = 'bilinear';
// 		ctx.fillStyle = this.colors.lightGrey;
// 		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


// 		ctx.globalCompositeOperation = 'multiply';

// 		// Center circle;
// 		this.drawCircle(
// 			this.relativeX(0.50),
// 			this.relativeY(0.50),
// 			this.relativeCircleSize(0.27),
// 			this.colors.green
// 		);

// 		// Top Left green circle - Plans
// 		this.drawCircle(
// 			this.coordinates.plans.x,
// 			this.coordinates.plans.y,
// 			this.relativeCircleSize(0.25),
// 			this.colors.green
// 		);

// 		// Top red circle - Highlights
// 		this.drawCircle(
// 			this.coordinates.highlights.x,
// 			this.coordinates.highlights.y,
// 			this.relativeCircleSize(0.235),
// 			this.colors.red
// 		);

// 		// Top right yellow - Friends
// 		this.drawCircle(
// 			this.coordinates.friends.x,
// 			this.coordinates.friends.y,
// 			this.relativeCircleSize(0.175),
// 			this.colors.yellow
// 		);

// 		// Right circle - Notes
// 		this.drawCircle(
// 			this.coordinates.notes.x,
// 			this.coordinates.notes.y,
// 			this.relativeCircleSize(0.185),
// 			this.colors.red
// 		);

// 		// Bottom right aqau circle - Verse Images
// 		this.drawCircle(
// 			this.coordinates.verseImgs.x,
// 			this.coordinates.verseImgs.y,
// 			this.relativeCircleSize(0.25),
// 			this.colors.aqua
// 		);

// 		// 2017 circle
// 		this.drawCircle(
// 			this.relativeX(0.80),
// 			this.relativeY(0.65),
// 			this.relativeCircleSize(0.097),
// 			this.colors.grey
// 		);

// 		// Bottom left yellow - Bookmarks
// 		this.drawCircle(
// 			this.coordinates.bookmarks.x,
// 			this.coordinates.bookmarks.y,
// 			this.relativeCircleSize(0.20),
// 			this.colors.yellow
// 		);


// 		// Bottom left red circle - Badges
// 		this.drawCircle(
// 			this.relativeX(0.305),
// 			this.relativeY(0.595),
// 			this.relativeCircleSize(0.14),
// 			this.colors.red
// 		);

// 		ctx.globalCompositeOperation = 'normal';
// 		ctx.font = `bold ${this.fontSize}px ${displayFont}`;
// 		ctx.fillStyle = 'white';
// 		ctx.textAlign = 'center';

// 		this.drawIcon(
// 			new Icon(
// 				this.icons.highlighter,
// 				this.relativeW(0.045),
// 				this.relativeH(0.045),
// 				this.momentData.highlights
// 			),
// 			this.coordinates.highlights
// 		);

// 		this.drawIcon(
// 			new Icon(
// 				this.icons.note,
// 				this.relativeW(0.042),
// 				this.relativeH(0.042),
// 				this.momentData.notes
// 			),
// 			this.coordinates.notes
// 		);


// 		this.drawIcon(
// 			new Icon(
// 				this.icons.verseImage,
// 				this.relativeW(0.05),
// 				this.relativeH(0.05),
// 				this.momentData.images
// 			),
// 			this.coordinates.verseImgs
// 		);


// 		this.drawIcon(
// 			new Icon(
// 				this.icons.bookmark,
// 				this.relativeW(0.037),
// 				this.relativeH(0.037),
// 				this.momentData.bookmarks
// 			),
// 			this.coordinates.bookmarks
// 		);


// 		this.drawIcon(
// 			new Icon(
// 				this.icons.friends,
// 				this.relativeW(0.045),
// 				this.relativeH(0.05),
// 				this.momentData.friendships
// 			),
// 			this.coordinates.friends
// 		);

// 		this.drawIcon(
// 			new Icon(
// 				this.icons.badges,
// 				this.relativeW(0.080),
// 				this.relativeH(0.040),
// 				this.momentData.badges
// 			),
// 			this.coordinates.badges
// 		)

// 		this.drawIcon(
// 			new Icon(
// 				this.icons.checkmark,
// 				this.relativeW(0.045),
// 				this.relativeH(0.045),
// 				this.momentData.plan_completions
// 			),
// 			this.coordinates.plans
// 		);

// 		this.drawProfileImage();

// 		// Draw 2017 text in small bubble
// 		const fontSize2017 = this.relativeFontSize() * 0.70;
// 		ctx.font = `${fontSize2017}px ${displayFont}`;
// 		ctx.fillText(new Intl.DateTimeFormat(this.locale, { year: 'numeric' }).format(1511908459070), this.relativeX(0.80), (this.relativeY(0.65) + (fontSize2017 / 2.5)));

// 		// Draw heading text
// 		const sizeModifier = lengthyStringLocales.includes(this.locale) ? 0.82 : 0.95;
// 		ctx.font = `bold ${this.relativeFontSize() * sizeModifier}px ${displayFont}`;
// 		ctx.fillStyle = '#000000';
// 		ctx.fillText(this.translate('my year'), this.relativeX(0.5), this.relativeY(0.1));


// 		// Draw bottom link text
// 		ctx.font = `${this.relativeFontSize() * 0.65}px ${displayFont}`;
// 		ctx.fillStyle = '#616161';
// 		ctx.fillText('Bible.com/app', this.relativeX(0.53), this.relativeY(0.94));

// 		const img = new Image();
// 		img.src = this.appLogo;
// 		ctx.drawImage(img, Math.round(this.relativeX(0.33)), Math.round(this.relativeY(0.895)), Math.round(this.relativeW(0.07)), Math.round(this.relativeH(0.07)));

// 	}

// 	drawIcon(icon, coords) {
// 		const { x, y, relY, iconYShift } = coords;
// 		const xPos = x;
// 		const yTextPos = y + (this.relativeFontSize() / 1.15);
// 		const displayDataText = icon.data !== 0;
// 		let yIconPos = this.relativeY(relY - iconYShift);

// 		if (!displayDataText) { yIconPos = y; }

// 		// Drawing images doesn't set origin point to center of image (like it does with arc drawing)
// 		// the origin point when drawing an image is top left.
// 		// Adjust canvas so that center of image is at x/y coordinates so we end up using similar
// 		// x and y coordinates as we do when drawing circles
// 		this.ctx.translate(xPos, yIconPos);
// 		this.ctx.drawImage(icon.image, Math.round((icon.width / 2) * -1), Math.round((icon.height / 2) * -1));
// 		this.ctx.translate((xPos) * (-1), (yIconPos) * (-1));

// 		if (displayDataText) {
// 			this.ctx.fillText(new Intl.NumberFormat(this.locale).format(icon.data), xPos, yTextPos);
// 		}

// 	}

// 	translate(str) {
// 		return this.localeData.messages[str];
// 	}

// 	drawProfileImage() {
// 		const ctx = this.ctx;
// 		const startAngle = 0;
// 		const endAngle = Math.PI * 2;
// 		const circleRadius = this.relativeCircleSize(0.19);
// 		const imageSize = circleRadius * 2;
// 		const centerPoint = this.relativeX(0.50);

// 		const img = new Image();
// 		img.src = this.avatarData;

// 		ctx.save();
// 		ctx.beginPath();
// 		ctx.arc(
// 			centerPoint,
// 			centerPoint,
// 			circleRadius,
// 			startAngle,
// 			endAngle,
// 			true
// 		);
// 		ctx.clip();
// 		ctx.drawImage(
// 			img,
// 			centerPoint - (imageSize / 2),
// 			centerPoint - (imageSize / 2),
// 			imageSize,
// 			imageSize
// 		);
// 		ctx.restore();
// 	}


// 	drawCircle(x, y, radius, color) {
// 		const ctx = this.ctx;
// 		const startAngle = 0;
// 		const endAngle = Math.PI * 2;

// 		ctx.fillStyle = color;
// 		ctx.beginPath();
// 		ctx.arc(x, y, radius, startAngle, endAngle, true);
// 		ctx.closePath();
// 		ctx.fill();
// 	}

// 	relativeFontSize() {
// 		return this.size * 0.05;
// 	}

// 	relativeCircleSize(pct) {
// 		return (this.size * pct) / 2;
// 	}

// 	relativeX(pct) {
// 		return (this.size * pct);
// 	}

// 	relativeY(pct) {
// 		return (this.size * pct);
// 	}

// 	relativeW(pct) {
// 		return (this.size * pct);
// 	}

// 	relativeH(pct) {
// 		return (this.size * pct);
// 	}
// }

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
