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
//const displayFont = 'Arial Unicode MS';
const displayFont = 'Futura';
const lengthyStringLocales = ['ar', 'vi', 'el']

global.Intl = require('intl');

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

class Snapshot {
	constructor(size) {
		this.size = size;
		this.width = size;
		this.height = size;
		this.widthRightPane = this.width * 0.375;
		this.widthLeftPane = this.width * 0.625;

		this.fontSize = this.relativeFontSize();
		this._canvas = new Canvas(size, size);
		this.ctx = this._canvas.getContext('2d');

		this.colors = {
			red: '#ec4e48',
			aqua: '#37a5ac',
			grey: '#868686',
			green: '#066261',
			yellow: '#eccf2d',
			lightGrey: '#f2f2f2',
			medGrey: '#424242',
			white: '#ffffff'
		}

		this.icons = {
			plan_completions: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 11"><path fill="#FFF" fill-rule="evenodd" d="M4.544 6.685l-2.24-1.777a.731.731 0 0 0-.968.053l-.466.46a.731.731 0 0 0-.053.98l3.188 3.935a.731.731 0 0 0 1.112.03l7.53-8.36a.731.731 0 0 0-.03-1.01l-.28-.277A.731.731 0 0 0 11.34.69L4.544 6.685z"/></svg>',
			highlights: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 13"><path fill="#FFF" fill-rule="evenodd" d="M3.332 8.768l2.172 2.171-1.702 1.702a.366.366 0 0 1-.26.107l-1.245-.002a.366.366 0 0 1-.257-.107l-1.032-1.03a.366.366 0 0 1 0-.516l2.324-2.325zm.455-1.41l6.31-6.309a.731.731 0 0 1 1.034 0l2.068 2.068a.731.731 0 0 1 0 1.035l-6.31 6.31a.731.731 0 0 1-1.034 0l-2.068-2.07a.731.731 0 0 1 0-1.033z"/></svg>',
			//streak: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 14"><path fill="#FFF" fill-rule="nonzero" d="M6.597 4.882l-1.527.41a.21.21 0 0 1-.263-.177L4.17.158a.21.21 0 0 0-.406-.044l-3.17 8.93a.21.21 0 0 0 .252.274l1.381-.37a.21.21 0 0 1 .264.18l.499 4.66a.21.21 0 0 0 .404.056l3.453-8.68a.21.21 0 0 0-.25-.282z"/></svg>',
			notes: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 10"><path fill="#FFF" fill-rule="evenodd" d="M6.262 9.233V7.017H8.48v-.554H5.986a.278.278 0 0 0-.278.277v2.493H1.277a.556.556 0 0 1-.556-.555V.922c0-.307.249-.555.556-.555h6.646c.307 0 .556.248.556.555v6.095L6.265 9.233h-.003zM7.371 3.97a.277.277 0 0 0-.277-.277H2.106a.277.277 0 1 0 0 .554h4.988a.277.277 0 0 0 .277-.277zm0-1.663a.277.277 0 0 0-.277-.277H2.106a.277.277 0 1 0 0 .554h4.988a.277.277 0 0 0 .277-.277z"/></svg>',
			images: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 15"><path fill="#FFF" fill-rule="evenodd" d="M8.546 8.793L6.668 5.337a.417.417 0 0 0-.733 0l-3.634 6.686a.417.417 0 0 0 .366.615h9.3a.417.417 0 0 0 .356-.634L9.806 7.896a.417.417 0 0 0-.71 0l-.55.897zM1.41.925H13.04c.46 0 .834.373.834.834V13.39c0 .46-.373.834-.834.834H1.41a.834.834 0 0 1-.834-.834V1.76c0-.46.373-.834.834-.834zm9.557 4.156a1.247 1.247 0 1 0 0-2.494 1.247 1.247 0 0 0 0 2.494z"/></svg>',
			badges: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.55 16.57"><defs><style>.cls-1{fill:none;}.cls-2{fill:#fff;}</style></defs><title>badge</title><path class="cls-1" d="M5.24,7.2H5.12a4,4,0,1,0,.12,0Zm.06,6.93a2.95,2.95,0,1,1,2.95-2.95A2.95,2.95,0,0,1,5.3,14.13Z"/><path class="cls-2" d="M6.6,6.41,9.83,4.53a1,1,0,0,0,.48-.94c0-.63,0-1.83,0-2.47S9.76.18,9.19.18h-8c-.55,0-.87.64-.87,1s0,2.47,0,2.47a1,1,0,0,0,.45.87l3.1,1.82.1.07a5,5,0,1,0,2.63,0ZM5.24,15.23a4,4,0,0,1-.12-8h.12a4,4,0,1,1,0,8Z"/><circle class="cls-2" cx="5.3" cy="11.19" r="2.95"/></svg>',
			bookmarks: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9"><path fill="#FFF" fill-rule="evenodd" d="M1.335.283h6.53c.345 0 .625.28.625.626v7.726a.313.313 0 0 1-.468.271L4.929 7.13a.625.625 0 0 0-.62-.001l-3.132 1.78a.313.313 0 0 1-.467-.271V.908c0-.345.28-.625.625-.625z"/></svg>',
			friendships: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9"><path fill="#FFF" fill-rule="evenodd" d="M8.642 4.014S8.405 5.44 6.829 5.42a1.733 1.733 0 0 1-1.782-1.415l-.155-1.048S4.707 1.135 6.386.891c0 0 .35-.051.762 0 .462.057 1.37.152 1.617 1.414 0 0 .052.326.031.62-.052.758-.154 1.09-.154 1.09zm-4.534.983s-.16 1.035-1.223 1.02C1.823 6.002 1.684 4.99 1.684 4.99l-.104-.762s-.125-1.323 1.007-1.5c0 0 .236-.038.514 0 .31.04.924.11 1.09 1.027 0 0 .035.237.021.451-.036.55-.104.792-.104.792zm2.671.884c2.182 0 3.48.682 3.894 2.046a.556.556 0 0 1-.531.718l-6.626.003a.556.556 0 0 1-.54-.687c.338-1.387 1.606-2.08 3.803-2.08zM2.705 8.65H.88a.556.556 0 0 1-.52-.753C.664 7.099 1.56 6.7 3.054 6.7c-.59.598-.902 1.473-.348 1.949z"/></svg>',
			perfect_weeks: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 30"><path fill="#FFF" fill-rule="evenodd" d="M16.128 24.692L9.96 29.737a.966.966 0 0 1-1.576-.788l.322-7.637-7.875-1.39a.966.966 0 0 1-.383-1.744l6.425-4.46-3.756-6.682a.966.966 0 0 1 1.081-1.408l7.811 1.999L15.25.554a.966.966 0 0 1 1.756 0l3.24 7.073 7.812-2a.966.966 0 0 1 1.081 1.41l-3.756 6.68 6.425 4.461a.966.966 0 0 1-.383 1.744l-7.875 1.39.322 7.637a.966.966 0 0 1-1.576.788l-6.168-5.045z"/></svg>'
		}


		this.defaultMomentData = {
			plan_completions: 0,
			highlights: 0,
			notes: 0,
			images: 0,
			badges: 0,
			bookmarks: 15,
			friendships: 0,
			days_in_app: 0,
			perfect_weeks: 1,
			plan_segment_completions: 0, 	// don't think we're using this
			plan_subscriptions: 0,				// and this.
		}

		this.translationStrings = {
			plan_completions: this.translate('plans.plans'),
			highlights: this.translate('profile menu.highlights'),
			notes: this.translate('profile menu.notes'),
			images: this.translate('profile menu.images'),
			badges: this.translate('profile menu.badges'),
			bookmarks: this.translate('profile menu.bookmarks'),
			friendships: this.translate('profile menu.friends'),
			my_year: this.translate('my year'),

			days_in_app: 'Days in the App',
			perfect_weeks: 'Perfect Weeks',
			plan_segment_completions: 0, 	// don't think we're using this
			plan_subscriptions: 0,				// and this.
		}


		this.momentData = {}; //todo remove this and reinstate api call
	}

	get canvas() { return this._canvas; }

	get locale() { return this._locale; }
	set locale(l) { this._locale = l; }

	get localeData() { return this._localeData; }
	set localeData(d) { this._localeData = d; }

	get avatarData() { return this._avatarData; }
	set avatarData(d) { this._avatarData = d; }

	get appLogo() { return this._appLogo; }
	set appLogo(l) { this._appLogo = l; }

	set horizontalGradient(grad) { this._horizontalGradient = grad; }
	get horizontalGradient() { return this._horizontalGradient; }

	get momentData() { return this._momentData; }
	set momentData(data = {}) { this._momentData = Object.assign({}, this.defaultMomentData, data); }

	get hasPerfectWeeks() { return this.momentData.perfect_weeks > 0; }
	get usableStats() {
		return [
			'badges',
			'bookmarks',
			'friendships',
			'highlights',
			'images',
			'notes',
			'plan_completions'
		].filter(stat => this.momentData[stat] !== 0);
	}

	fontStyle({ bold = false, sizeModifier = 1.0, font = displayFont }) {
		return `${bold ? 'bold' : ''} ${this.relativeFontSize() * sizeModifier}px ${font}`;
	}

	setupContext() {
		const ctx = this.ctx;
		ctx.antialias = 'subpixel';
		ctx.patternQuality = 'bilinear';
		ctx.filter = 'bilinear';
	}

	drawBackground() {
		const ctx = this.ctx;
		ctx.fillStyle = this.colors.lightGrey;
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawRightPane() {
		const ctx = this.ctx;
		const rightGradient = ctx.createLinearGradient(this.widthLeftPane, 0, this.widthLeftPane, this.height);
			rightGradient.addColorStop(0, '#17dad6');
			rightGradient.addColorStop(0.5, '#2188b3');
			rightGradient.addColorStop(1, '#2b3890');


		ctx.fillStyle = rightGradient;
		ctx.fillRect(this.widthLeftPane, 0, this.widthRightPane, this.canvas.height)
	}

	drawHeadingText() {
		// My Year in the Bible App
		const ctx = this.ctx;
		const headerString = this.translationStrings.my_year.toUpperCase(); // upcase here to make sure text measurements are correct later
		const headerSizeMod = lengthyStringLocales.includes(this.locale) ? 0.42 : 0.55;

		ctx.font = this.fontStyle({ sizeModifier: headerSizeMod });
		ctx.fillStyle = this.colors.medGrey;

		const headerTextW = ctx.measureText(headerString).width;
		const headerX = this.relativeX(0.5, this.widthLeftPane) - (headerTextW / 2);
		ctx.fillText(headerString, headerX, this.relativeY(0.15));
	}

	drawPerfectWeeks() {

		// setup gradient based off pill size first.
		const ctx = this.ctx;
		const pillX = this.relativeX(0.15, this.widthLeftPane);
		const pillY = this.relativeY(0.7);
		const pillW = this.relativeW(0.70, this.widthLeftPane);
		const pillH = this.relativeH(0.085);
		const pillRadius = this.relativeH(0.55, pillH);
		const gradient = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY + pillH);
			gradient.addColorStop(0, '#2b3890');
			gradient.addColorStop(0.5, '#2188b3');
			gradient.addColorStop(1, '#17dad6');

		this.horizontalGradient = gradient

		// Don't draw
		if (!this.hasPerfectWeeks) return;

		this.horizontalGradient = gradient

		this.drawRoundRect(
			pillX,
			pillY,
			pillW,
			pillH,
			pillRadius,
			gradient,
		);

		const pillString = this.translationStrings.perfect_weeks.toUpperCase();
		const statString = this.momentData.perfect_weeks;
		const iconW = this.relativeW(0.04);
		const iconH = this.relativeW(0.04);
		let iconX = 0;
		let iconY = 0;
		let textX = 0;
		let textW = 0;
		let textY = 0;
		let statX = 0;
		let statY = 0;
		let statW = 0;

		let startX = 0;
		let endX = 0;
		let innerW = 0;
		let outerW = 0;
		let pillPadding = 0;

		ctx.font = this.fontStyle({ sizeModifier: 0.50 });
		ctx.fillStyle = this.colors.white;

		textW = ctx.measureText(pillString).width;
		statW = ctx.measureText(statString).width;

		// measure the inside text for centering purposes
		startX = pillX;
		endX = startX + (textW / 1.5) + iconW + statW;
		innerW = endX - startX;
		outerW = (pillW + (pillRadius * 2));
		pillPadding = (outerW - innerW) / 2;  // this is where we start drawing text inside pill on X axis


		// Start text rendering at pillPadding value
		// Build all other X locations for icon and stat values upon the previously drawn item
		textX = pillPadding;
		textY = pillY + (pillH / 1.65);
		ctx.fillText(pillString, textX, textY);


		iconX = textX + textW + iconW;
		iconY = textY - (iconH / 4);
		this.drawIcon(
			new Icon(this.icons.perfect_weeks, iconW, iconH),
			iconX,
			iconY
		);


		statX = iconX + (iconW);
		statY = textY;
		ctx.font = this.fontStyle({bold: true, sizeModifier: 0.50 });
		ctx.fillText(statString, statX, statY);
	}


	drawDaysInApp() {
		const ctx = this.ctx;
		const daysString = this.translationStrings.days_in_app.toUpperCase(); // upcase here to make sure text measurements are correct later
		const daysStringY = this.hasPerfectWeeks ? this.relativeY(0.65) : this.relativeY(0.75);
		const localeSizeModifier = lengthyStringLocales.includes(this.locale) ? 0.52 : 0.65;
		const overallModifier = localeSizeModifier * (this.hasPerfectWeeks ? 1 : 1.25);


		ctx.fillStyle = this.horizontalGradient;
		ctx.font = this.fontStyle({
			bold: true,
			sizeModifier: overallModifier
		})

		const daysStringW = ctx.measureText(daysString).width
		const daysStringX = this.relativeX(0.5, this.widthLeftPane) - (daysStringW / 2);
		ctx.fillText(
			daysString.toUpperCase(),
			daysStringX,
			daysStringY
		);
	}

	drawDays() {
		// Dependent on perfect weeks, if there is perfect week data, we draw smaller, otherwise bigger

		const ctx = this.ctx;
		const dayNumString = '264';
		const dayNumStringY = this.hasPerfectWeeks ? this.relativeY(0.57) : this.relativeY(0.65);

		ctx.font = this.fontStyle({
			bold: true,
			sizeModifier: this.hasPerfectWeeks? 3.85 : 5.5
		});

		const dayNumStringW = ctx.measureText(dayNumString).width;
		const dayNumStringX = this.relativeX(0.5, this.widthLeftPane) - (dayNumStringW / 2);
		ctx.fillText(
			dayNumString,
			dayNumStringX,
			dayNumStringY
		);
	}

	drawAppLink() {
		const ctx = this.ctx;
		const fontColor = '#616161';
		const text = 'Bible.com/app';

		ctx.font = this.fontStyle({ sizeModifier: 0.45 });
		ctx.fillStyle = fontColor;
		ctx.fillText(
			text,
			this.relativeX(0.48, this.widthLeftPane),
			this.relativeY(0.91)
		);

		const img = new Image();
		img.src = this.appLogo;
		ctx.drawImage(
			img,
			Math.round(this.relativeX(0.33, this.widthLeftPane)),
			Math.round(this.relativeY(0.865)),
			Math.round(this.relativeW(0.07)),
			Math.round(this.relativeH(0.07))
		);
	}

	drawSingleStat(statsArray) {
		const stat = statsArray[0]

		this.drawVerticalStat(
			this.translationStrings[stat],
			new Icon(
				this.icons[stat],
				this.relativeW(0.15),
				this.relativeH(0.15)
			),
			15,
			this.relativeY(0.40),
			2.5
		)
	}

	drawMultipleStats(stats) {
		switch(stats.length) {
			case 2:

				this.drawVerticalStat(
					this.translate('profile menu.images'),
					new Icon(
						this.icons.images,
						this.relativeW(0.08),
						this.relativeH(0.08)
					),
					15,
					this.relativeY(0.25),
					1.5
				)

				this.drawVerticalStat(
					this.translate('profile menu.images'),
					new Icon(
						this.icons.images,
						this.relativeW(0.08),
						this.relativeH(0.08)
					),
					15,
					this.relativeY(0.65),
					1.5
				)


				break;

			case 3:

				this.drawVerticalStat(
					this.translate('profile menu.images'),
					new Icon(
						this.icons.images,
						this.relativeW(0.08),
						this.relativeH(0.08)
					),
					15,
					this.relativeY(0.15),
					1.5
				)

				this.drawVerticalStat(
					this.translate('profile menu.images'),
					new Icon(
						this.icons.images,
						this.relativeW(0.08),
						this.relativeH(0.08)
					),
					15,
					this.relativeY(0.45),
					1.5
				)

				this.drawVerticalStat(
					this.translate('profile menu.images'),
					new Icon(
						this.icons.images,
						this.relativeW(0.08),
						this.relativeH(0.08)
					),
					15,
					this.relativeY(0.75),
					1.5
				)

				break;
		}
	}

	drawAllStats() {
				// Drawing Stats
		const beginStatY = 0.30;
		const statH = 0.08

		this.drawStat(
			this.translationStrings.plan_completions,
			new Icon(
				this.icons.plan_completions,
				this.relativeW(0.030),
				this.relativeH(0.030)
			),
			this.momentData.plan_completions,
			this.relativeY(beginStatY)
		)

		// Draw Highlight Stat
		this.drawStat(
			this.translationStrings.highlights,
			new Icon(
				this.icons.highlights,
				this.relativeW(0.030),
				this.relativeH(0.030)
			),
			this.momentData.highlights,
			this.relativeY(beginStatY + (statH * 1))
		)


		// Draw Bookmark Stat
		this.drawStat(
			this.translationStrings.bookmarks,
			new Icon(
				this.icons.bookmarks,
				this.relativeW(0.027),
				this.relativeH(0.027)
			),
			this.momentData.bookmarks,
			this.relativeY(beginStatY + (statH * 2))
		)

		// Draw Verse Images state
		this.drawStat(
			this.translationStrings.images,
			new Icon(
				this.icons.images,
				this.relativeW(0.028),
				this.relativeH(0.028)
			),
			this.momentData.images,
			this.relativeY(beginStatY + (statH * 3))
		)


		// Draw Badges
		this.drawStat(
			this.translationStrings.badges,
			new Icon(
				this.icons.badges,
				this.relativeW(0.030),
				this.relativeH(0.030)
			),
			this.momentData.badges,
			this.relativeY(beginStatY + (statH * 4))
		)


		// Draw Friendships
		this.drawStat(
			this.translationStrings.friendships,
			new Icon(
				this.icons.friendships,
				this.relativeW(0.030),
				this.relativeH(0.030)
			),
			this.momentData.friendships,
			this.relativeY(beginStatY + (statH * 5))
		)

		// Draw Notes
		this.drawStat(
			this.translationStrings.notes,
			new Icon(
				this.icons.notes,
				this.relativeW(0.028),
				this.relativeH(0.028)
			),
			this.momentData.notes,
			this.relativeY(beginStatY + (statH * 6)),
			false
		)
	}

	drawStats() {
		switch (this.usableStats.length) {
			case 0:
				return;  // do nothing

			case 1:
				this.drawSingleStat(this.usableStats);
				break;

			case 2:
			case 3:
				this.drawMultipleStats(this.usableStats)
				break;

			default:
				this.drawAllStats();
		}
	}

	render() {
		this.setupContext();
		this.drawBackground();
		this.drawRightPane();
		this.drawHeadingText();
		this.drawPerfectWeeks(); // sets up the horizontal gradient, should come before others using gradient
		this.drawDaysInApp();
		this.drawProfileImage();

		this.drawDays();
		this.drawAppLink();
		this.drawStats();
	}

	drawStat(statString, statIcon, statNum, statY, drawSeparator = true) {
		const ctx = this.ctx;
		const stringX = this.relativeX(1.05, this.widthLeftPane);
		const separatorX = this.relativeX(1.035, this.widthLeftPane);
		const numX = this.relativeX(0.94, this.width);

		// String to left (Plan, Highlight, etc)
		ctx.font = `${this.relativeFontSize() * 0.35}px ${displayFont}`;
		ctx.fillStyle = this.colors.white;
		ctx.fillText(
			statString.toUpperCase(),
			stringX,
			statY,
		);

		// Stat number to the right
		ctx.font = `${this.relativeFontSize() * 0.45}px ${displayFont}`;

		ctx.fillText(
			statNum,
			numX,
			statY,
		)

		this.drawIcon(
			statIcon,
			this.relativeX(0.9),
			statY - (statIcon.height / 3),
		);

		if (drawSeparator) {
			const lineY = statY + statIcon.height;
			ctx.beginPath();
			ctx.moveTo(separatorX, lineY);
			ctx.lineTo(this.width, lineY);
			ctx.strokeStyle = this.colors.lightGrey;
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}

	drawVerticalStat(statString, statIcon, statNum, statY, textSizeModifier) {
		const ctx = this.ctx;
		const xPos = this.widthLeftPane + (this.widthRightPane / 2);
		let numW = 0;
		let stringX = 0;
		let stringY = 0;
		let stringW = 0;
		let stringH = 0;

		// String to left (Plan, Highlight, etc)
		ctx.font = `${(this.relativeFontSize() * textSizeModifier) / 4}px ${displayFont}`;
		ctx.fillStyle = this.colors.white;
		stringW = ctx.measureText(statString).width;
		stringH = ctx.measureText(statString).height;
		stringX = xPos - (stringW * 0.60);
		stringY = statY - (statIcon.height / 1.5);

		ctx.fillText(
			statString.toUpperCase(),
			stringX,
			stringY
		);

		this.drawIcon(
			statIcon,
			xPos,
			statY
		);

		ctx.font = `${this.relativeFontSize() * textSizeModifier}px ${displayFont}`;
		ctx.fillStyle = this.colors.white;
		numW = ctx.measureText(statNum).width;

		ctx.fillText(
			statNum,
			xPos - (numW * 0.5),
			statY + (statIcon.height * 1.5),
		)
	}


	drawIcon(icon, x, y) {
		// Drawing images doesn't set origin point to center of image (like it does with arc drawing)
		// the origin point when drawing an image is top left.
		// Adjust canvas so that center of image is at x/y coordinates so we end up using similar
		// x and y coordinates as we do when drawing circles
		this.ctx.translate(x, y);
		this.ctx.drawImage(
			icon.image,
			Math.round((icon.width / 2) * -1),
			Math.round((icon.height / 2) * -1)
		);
		this.ctx.translate((x) * (-1), (y) * (-1));
	}

	translate(str) {
		return this.localeData.messages[str];
	}

	drawProfileImage() {
		const startAngle = 0;
		const endAngle = Math.PI * 2;
		const circleRadius = this.relativeCircleSize(0.17);
		const imageSize = circleRadius * 2;
		const halfImageSize = imageSize / 2
		const x = this.relativeX(0.50, this.widthLeftPane);
		const y = this.relativeY(0.28);
		const textY = this.relativeY (0.29);
		const ctx = this.ctx;

		const img = new Image();
			img.src = this.avatarData;

		ctx.save();
		ctx.beginPath();
		ctx.arc(
			x,
			y,
			circleRadius,
			startAngle,
			endAngle,
			true
		);
		ctx.clip();
		ctx.drawImage(
			img,
			x - halfImageSize,
			y - halfImageSize,
			imageSize,
			imageSize
		);
		ctx.restore();

		ctx.font = this.fontStyle({});
		ctx.fillStyle = this.horizontalGradient;

		const text20 = '20'
		const text18 = '18'

		ctx.fillText(
			text20,
			x - halfImageSize - ctx.measureText(text20).width - this.relativeW(0.015),// - halfImageSize,// - (ctx.measureText(text20).width * 1.5),
			textY
		);

		ctx.fillText(
			text18,
			x + halfImageSize + this.relativeW(0.015),// + (ctx.measureText(text18).width * 1.5),
			textY
		);
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


	drawRoundRect(x, y, width, height, radius, fill) {
		const ctx = this.ctx;

		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo((x + width) - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, (y + height) - radius);
		ctx.quadraticCurveTo(x + width, y + height, (x + width) - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, (y + height) - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
};


	relativeFontSize() {
		return this.size * 0.05;
	}

	relativeCircleSize(pct) {
		return (this.size * pct) / 2;
	}

	relativeX(pct, rTo = null) {
		const relativeTo = (rTo === null) ? this.size : rTo;
		return (relativeTo * pct);
	}

	relativeY(pct, rTo = null) {
		const relativeTo = (rTo === null) ? this.size : rTo;
		return (relativeTo * pct);
	}

	relativeW(pct, rTo = null) {
		const relativeTo = (rTo === null) ? this.size : rTo;
		return (relativeTo * pct);
	}

	relativeH(pct, rTo = null) {
		const relativeTo = (rTo === null) ? this.size : rTo;
		return (relativeTo * pct);
	}
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

router.get('/snapshot/default/:size', (req, res) => {
	const imageSize = parseInt(req.params.size, 10);
	const logo = getLogo(imageSize);
	const locale = cleanLocale(req.query.locale || 'en-US');
	const avatar = new AvatarImage({ default: true });

	if (!isSizeValid(imageSize)) {
		res.status(404).send('Not found');
	}

	const graphic = new Snapshot(imageSize);

	graphic.appLogo = logo;
	graphic.locale = locale;
	graphic.localeData = getLocale({
		localeFromUrl: locale, localeFromCookie: null, localeFromUser: null, acceptLangHeader: null
	})

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
	const fromDate = '2017-01-01';
	const toDate = '2017-12-31';
	const userId = req.params.user_id;
	const imageSize = parseInt(req.params.size, 10);
	const logo = getLogo(imageSize);
	const locale = cleanLocale(req.query.locale || 'en-US');
	let avatar;

	if (!isHashValid(req.params.user_id_hash, req.params.user_id)) {
		res.status(404).send('Not found');
	}

	if (!isSizeValid(imageSize)) {
		res.status(404).send('Not found');
	}

	const graphic = new Snapshot(imageSize);

	graphic.appLogo = logo;
	graphic.locale = locale;
	graphic.localeData = getLocale({
		localeFromUrl: locale, localeFromCookie: null, localeFromUser: null, acceptLangHeader: null
	})

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

		//graphic.momentData = momentData;
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
