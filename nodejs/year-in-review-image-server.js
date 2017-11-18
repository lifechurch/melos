const express = require('express');
const Canvas = require('canvas');
const canvg = require('canvg');
const Promise = require('bluebird');
const http = require('http');
const api = require('@youversion/js-api');

const Image = Canvas.Image;
const Users = api.getClient('users');
const Moments = api.getClient('moments');
const router = express.Router();

class Icon {
	constructor(svgString, w, h, data = null) {
		this.svgString = svgString;
		this.width = w;
		this.height = h;
		this.canvas = new Canvas(w, h);
		this.image = new Image();
		this.data = data;
		this.render();
	}

	render() {
		canvg(this.canvas, this.svgString, { ignoreMouse: true, ignoreAnimation: true, ImageClass: Image });
		this.image.src = this.canvas.toBuffer();
	}
}

class YiR {
	constructor(size) {

		this.size = size;
		this.width = size;
		this.height = size;
		this.fontSize = this.relativeFontSize();
		this.fontStyle = `${this.fontSize}px Arial Bold`;

		this._canvas = new Canvas(size,size);
		this.ctx = this._canvas.getContext('2d');

		this.colors = {
			red: '#ec4e48',
			aqua: '#37a5ac',
			grey: '#868686',
			green: '#066261',
			yellow: '#eccf2d',
			lightGrey: '#f2f2f2'
		}

		this.icons = {
			checkmark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 11"><path fill="#FFF" fill-rule="evenodd" d="M4.544 6.685l-2.24-1.777a.731.731 0 0 0-.968.053l-.466.46a.731.731 0 0 0-.053.98l3.188 3.935a.731.731 0 0 0 1.112.03l7.53-8.36a.731.731 0 0 0-.03-1.01l-.28-.277A.731.731 0 0 0 11.34.69L4.544 6.685z" opacity=".9"/></svg>',
			highlighter: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 13"><path fill="#FFF" fill-rule="evenodd" d="M3.332 8.768l2.172 2.171-1.702 1.702a.366.366 0 0 1-.26.107l-1.245-.002a.366.366 0 0 1-.257-.107l-1.032-1.03a.366.366 0 0 1 0-.516l2.324-2.325zm.455-1.41l6.31-6.309a.731.731 0 0 1 1.034 0l2.068 2.068a.731.731 0 0 1 0 1.035l-6.31 6.31a.731.731 0 0 1-1.034 0l-2.068-2.07a.731.731 0 0 1 0-1.033z" opacity=".9"/></svg>',
			streak: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 14"><path fill="#FFF" fill-rule="nonzero" d="M6.597 4.882l-1.527.41a.21.21 0 0 1-.263-.177L4.17.158a.21.21 0 0 0-.406-.044l-3.17 8.93a.21.21 0 0 0 .252.274l1.381-.37a.21.21 0 0 1 .264.18l.499 4.66a.21.21 0 0 0 .404.056l3.453-8.68a.21.21 0 0 0-.25-.282z"/></svg>',
			note: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 10"><path fill="#FFF" fill-rule="evenodd" d="M6.262 9.233V7.017H8.48v-.554H5.986a.278.278 0 0 0-.278.277v2.493H1.277a.556.556 0 0 1-.556-.555V.922c0-.307.249-.555.556-.555h6.646c.307 0 .556.248.556.555v6.095L6.265 9.233h-.003zM7.371 3.97a.277.277 0 0 0-.277-.277H2.106a.277.277 0 1 0 0 .554h4.988a.277.277 0 0 0 .277-.277zm0-1.663a.277.277 0 0 0-.277-.277H2.106a.277.277 0 1 0 0 .554h4.988a.277.277 0 0 0 .277-.277z" opacity=".9"/></svg>',
			verseImage: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 15"><path fill="#FFF" fill-rule="evenodd" d="M8.546 8.793L6.668 5.337a.417.417 0 0 0-.733 0l-3.634 6.686a.417.417 0 0 0 .366.615h9.3a.417.417 0 0 0 .356-.634L9.806 7.896a.417.417 0 0 0-.71 0l-.55.897zM1.41.925H13.04c.46 0 .834.373.834.834V13.39c0 .46-.373.834-.834.834H1.41a.834.834 0 0 1-.834-.834V1.76c0-.46.373-.834.834-.834zm9.557 4.156a1.247 1.247 0 1 0 0-2.494 1.247 1.247 0 0 0 0 2.494z"/></svg>',
			bookmark: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9"><path fill="#FFF" fill-rule="evenodd" d="M1.335.283h6.53c.345 0 .625.28.625.626v7.726a.313.313 0 0 1-.468.271L4.929 7.13a.625.625 0 0 0-.62-.001l-3.132 1.78a.313.313 0 0 1-.467-.271V.908c0-.345.28-.625.625-.625z" opacity=".9"/></svg>',
			friends: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9"><path fill="#FFF" fill-rule="evenodd" d="M8.642 4.014S8.405 5.44 6.829 5.42a1.733 1.733 0 0 1-1.782-1.415l-.155-1.048S4.707 1.135 6.386.891c0 0 .35-.051.762 0 .462.057 1.37.152 1.617 1.414 0 0 .052.326.031.62-.052.758-.154 1.09-.154 1.09zm-4.534.983s-.16 1.035-1.223 1.02C1.823 6.002 1.684 4.99 1.684 4.99l-.104-.762s-.125-1.323 1.007-1.5c0 0 .236-.038.514 0 .31.04.924.11 1.09 1.027 0 0 .035.237.021.451-.036.55-.104.792-.104.792zm2.671.884c2.182 0 3.48.682 3.894 2.046a.556.556 0 0 1-.531.718l-6.626.003a.556.556 0 0 1-.54-.687c.338-1.387 1.606-2.08 3.803-2.08zM2.705 8.65H.88a.556.556 0 0 1-.52-.753C.664 7.099 1.56 6.7 3.054 6.7c-.59.598-.902 1.473-.348 1.949z" opacity=".9"/></svg>'
		}

		this.coordinates = {
			plans: {
				x: this.relativeX(0.285),
				y: this.relativeY(0.42),
				relX: 0.285,
				relY: 0.42,
				iconYShift: 0.025
			},
			highlights: {
				x: this.relativeX(0.47),
				y: this.relativeY(0.28),
				relX: 0.47,
				relY: 0.28,
				iconYShift: 0.035
			},
			friends: {
				x: this.relativeX(0.65),
				y: this.relativeY(0.365),
				relX: 0.65,
				relY: 0.365,
				iconYShift: 0.025
			},
			notes: {
				x: this.relativeX(0.712),
				y: this.relativeY(0.527),
				relX: 0.712,
				relY: 0.527,
				iconYShift: 0.02
			},
			verseImgs: {
				x: this.relativeX(0.64),
				y: this.relativeY(0.725),
				relX: 0.64,
				relY: 0.725,
				iconYShift: 0.03
			},
			bookmarks: {
				x: this.relativeX(0.455),
				y: this.relativeY(0.7),
				relX: 0.455,
				relY: 0.7,
				iconYShift: 0.03
			},
			badges: {
				x: this.relativeX(0.305),
				y: this.relativeY(0.595),
				relX: 0.305,
				relY: 0.595
			}
		}
	}

	get canvas() { return this._canvas; }
	get avatarData() { return this._avatarData; }
	set avatarData(d) { this._avatarData = d; }
	get momentData() { return this._momentData; }
	set momentData(data) {
		const defaults = {
			badges: 0,
			bookmarks: 0,
			friendships: 0,
			highlights: 0,
			images: 0,
			notes: 0,
			plan_completions: 0,
			plan_segment_completions: 0,
			plan_subscriptions: 0
		}
		this._momentData = Object.assign({}, defaults, data);
	}

	render() {
		const ctx = this.ctx;

		ctx.fillStyle = this.colors.lightGrey;
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


		ctx.globalCompositeOperation = 'multiply';

		// Center circle;
		this.drawCircle(
			this.relativeX(0.50),
			this.relativeY(0.50),
			this.relativeCircleSize(0.27),
			this.colors.green
		);

		// Top Left green circle - Plans
		this.drawCircle(
			this.coordinates.plans.x,
			this.coordinates.plans.y,
			this.relativeCircleSize(0.25),
			this.colors.green
		);

		// Top red circle - Highlights
		this.drawCircle(
			this.coordinates.highlights.x,
			this.coordinates.highlights.y,
			this.relativeCircleSize(0.235),
			this.colors.red
		);

		// Top right yellow - Friends
		this.drawCircle(
			this.coordinates.friends.x,
			this.coordinates.friends.y,
			this.relativeCircleSize(0.175),
			this.colors.yellow
		);

		// Right circle - Notes
		this.drawCircle(
			this.coordinates.notes.x,
			this.coordinates.notes.y,
			this.relativeCircleSize(0.185),
			this.colors.red
		);

		// Bottom right aqau circle - Verse Images
		this.drawCircle(
			this.coordinates.verseImgs.x,
			this.coordinates.verseImgs.y,
			this.relativeCircleSize(0.25),
			this.colors.aqua
		);

		// 2017 circle
		this.drawCircle(
			this.relativeX(0.78),
			this.relativeY(0.64),
			this.relativeCircleSize(0.065),
			this.colors.grey
		);

		// Bottom left yellow - Bookmarks
		this.drawCircle(
			this.coordinates.bookmarks.x,
			this.coordinates.bookmarks.y,
			this.relativeCircleSize(0.20),
			this.colors.yellow
		);

		// Bottom left red circle - Badges
		this.drawCircle(
			this.relativeX(0.305),
			this.relativeY(0.595),
			this.relativeCircleSize(0.14),
			this.colors.red
		);

		ctx.globalCompositeOperation = 'normal';
		ctx.font = this.fontStyle;
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';

		this.drawIcon(
			new Icon(
				this.icons.highlighter,
				this.relativeW(0.045),
				this.relativeH(0.045),
				this.momentData.highlights
			),
			this.coordinates.highlights
		);


		// this.drawIcon(
		// 	new Icon(
		// 		this.icons.streak,
		// 		this.relativeW(0.035),
		// 		this.relativeW(0.05),
		// 		0
		// 	),
		// 	this.coordinates.streaks
		// );

		this.drawIcon(
			new Icon(
				this.icons.note,
				this.relativeW(0.042),
				this.relativeH(0.042),
				this.momentData.notes
			),
			this.coordinates.notes
		);


		this.drawIcon(
			new Icon(
				this.icons.verseImage,
				this.relativeW(0.05),
				this.relativeH(0.05),
				this.momentData.images
			),
			this.coordinates.verseImgs
		);


		this.drawIcon(
			new Icon(
				this.icons.bookmark,
				this.relativeW(0.037),
				this.relativeH(0.037),
				this.momentData.bookmarks
			),
			this.coordinates.bookmarks
		);


		this.drawIcon(
			new Icon(
				this.icons.friends,
				this.relativeW(0.045),
				this.relativeH(0.05),
				this.momentData.friendships
			),
			this.coordinates.friends
		);


		// Still need to draw badges icon
		ctx.fillText('2', this.coordinates.badges.x,this.coordinates.badges.y);

		this.drawIcon(
			new Icon(
				this.icons.checkmark,
				this.relativeW(0.045),
				this.relativeH(0.045),
				this.momentData.plan_completions
			),
			this.coordinates.plans
		);

		this.drawProfileImage();

		// Draw 2017 text in small bubble
		const fontSize2017 = this.relativeFontSize() / 2.2;
		ctx.font = `${fontSize2017}px Arial Bold`;
		ctx.fillText('2017', this.relativeX(0.78), (this.relativeY(0.64) + (fontSize2017 / 2.5)));

		// Draw heading text
		ctx.font = `${this.relativeFontSize() * 0.95}px Arial Bold`;
		ctx.fillStyle = '#066261';
		ctx.fillText('My Year in the Bible App', this.relativeX(0.5), this.relativeY(0.1));


	}

	drawIcon(icon, coords) {
		const { x, y, relY, iconYShift } = coords;
		const xPos = x;
		const yTextPos = y + (this.relativeFontSize() / 1.15);
		const displayDataText = icon.data !== 0;
		let yIconPos = this.relativeY(relY - iconYShift);

		if (!displayDataText) { yIconPos = y; }

		// Drawing images doesn't set origin point to center of image (like it does with arc drawing)
		// the origin point when drawing an image is top left.
		// Adjust canvas so that center of image is at x/y coordinates so we end up using similar
		// x and y coordinates as we do when drawing circles
		this.ctx.translate(xPos, yIconPos);
		this.ctx.drawImage(icon.image, Math.round((icon.width / 2) * -1), Math.round((icon.height / 2) * -1));
		this.ctx.translate((xPos) * (-1), (yIconPos) * (-1));

		if (displayDataText) {
			this.ctx.fillText(icon.data, xPos, yTextPos);
		}

	}

	drawProfileImage() {
		const ctx = this.ctx;
		const startAngle = 0;
		const endAngle = Math.PI * 2;
		const circleRadius = this.relativeCircleSize(0.19);
		const imageSize = circleRadius * 2;
		const centerPoint = this.relativeX(0.50);

		const img = new Image();
		img.src = this.avatarData;

		ctx.save();
		ctx.beginPath();
		ctx.arc(
			centerPoint,
			centerPoint,
			circleRadius,
			startAngle,
			endAngle,
			true
		);
		ctx.clip();
		ctx.drawImage(
			img,
			centerPoint - (imageSize / 2),
			centerPoint - (imageSize / 2),
			imageSize,
			imageSize
		);
		ctx.restore();
	}


	drawCircle(x, y, radius, color) {
		const ctx = this.ctx;
		const startAngle = 0;
		const endAngle = Math.PI * 2;

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, radius, startAngle, endAngle, true);
		ctx.closePath();
		ctx.fill();
	}

	relativeFontSize() {
		return this.size * 0.05;
	}

	relativeCircleSize(pct) {
		return (this.size * pct) / 2;
	}

	relativeX(pct) {
		return (this.size * pct);
	}

	relativeY(pct) {
		return (this.size * pct);
	}

	relativeW(pct) {
		return (this.size * pct);
	}

	relativeH(pct) {
		return (this.size * pct);
	}
}

class AvatarImage {

	constructor(url) {
		this.url = url;
	}

	load(cb) {
		const data = [];
		http.get(this.url, (response) => {
			response.on('data', (chunk) => {
				data.push(chunk);
			});
			response.on('end', () => {
				cb(Buffer.concat(data));
			});
		});
	}
}

//https://nodejs.bible.com/{language-tag}/year-in-review/{user-id-hash}/{size}
router.get('/year-in-review/:user_id/:size', (req, res) => {

	const fromDate = '2017-01-01';
	const toDate = '2017-12-31';
	const userId = req.params.user_id;
	const graphic = new YiR(500);
	let avatar;

	const userPromise = Users.call('view')
	.setEnvironment('staging')
	.params({ id: userId })
	.get()

	const momentPromise = Moments.call('summary')
	.setEnvironment('staging')
	.params({ user_id: userId, from_date: fromDate, to_date: toDate })
	.get()

	Promise.all([userPromise, momentPromise])
	.then((results) => {
		const userData = results[0];
		const momentData = results[1];

		graphic.momentData = momentData;
		avatar = new AvatarImage(`http:${userData.user_avatar_url.px_512x512}`);
		avatar.load((data) => {
			graphic.avatarData = data;

			graphic.render();
			res.setHeader('Content-Type', 'image/png');
			graphic.canvas.pngStream().pipe(res);
		})
	})
})

module.exports = router;