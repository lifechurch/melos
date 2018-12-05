const { createCanvas, registerFont, Canvas, Image } = require('canvas');
const canvg = require('canvg');
const StackBlur = require('stackblur-canvas');

global.Intl = require('intl');
const displayFont = 'Futura PT Cond';

const localeSizes = {
	el: {
		my_year: 0.25,
		perfect_weeks: 0.30,
		days_in_app: 0.45
	},

	vi: {
		my_year: 0.35,
		perfect_weeks: 0.35,
		days_in_app: 0.52
	},

	fa: {
		my_year: 0.35,
		perfect_weeks: 0.35,
		days_in_app: 0.52,
	},

	'my-MM': {
		my_year: 0.35,
		perfect_weeks: 0.25,
		days_in_app: 0.45
	},

	th: {
		perfect_weeks: 0.30
	},

	my: {
		perfect_weeks: 0.25,
		days_in_app: 0.45
	},

	ta: {
		my_year: 0.3,
		perfect_weeks: 0.30,
		days_in_app: 0.52,
		badges: 0.26,
	},

	mk: {
		plan_completions: 0.3,
	},

	'zh-CN': {
		plan_completions: 0.3,
	},

	ro: {
		days_in_app: 0.55
	},

	all: {
		my_year: 0.55,
		perfect_weeks: 0.45,
		days_in_app: 0.65,
		plan_completions: 0.35,
		highlights: 0.35,
		bookmarks: 0.35,
		images: 0.35,
		badges: 0.35,
		friendships: 0.35,
		notes: 0.35,
	}
}

function getLocaleSize(locale, key) {
	if (locale in localeSizes) {
		if (key in localeSizes[locale]) {
			return localeSizes[locale][key];
		} else {
			return localeSizes.all[key]
		}
	} else {
		return localeSizes.all[key]
	}

}


registerFont('./fonts/FuturaPTCondBold.ttf', { family: 'Futura PT Cond' });
registerFont('./fonts/FuturaPTCondExtraBold.ttf', { family: 'Futura PT Cond Extra Bold' });
registerFont('./fonts/FuturaPTLight.ttf', { family: 'Futura PT Light' });
registerFont('./fonts/FuturaPTCondMedium.ttf', { family: 'Futura PT Cond Medium' });

const OrderedStatNames = [
	'plan_completions',
	'highlights',
	'bookmarks',
	'images',
	'badges',
	'friendships',
	'notes',
]

const Colors = {
	red: '#ec4e48',
	aqua: '#37a5ac',
	grey: '#868686',
	green: '#066261',
	yellow: '#eccf2d',
	lightGrey: '#f2f2f2',
	medGrey: '#424242',
	white: '#ffffff'
}

const Svgs = {
	plan_completions: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 11"><path fill="#FFF" fill-rule="evenodd" d="M4.544 6.685l-2.24-1.777a.731.731 0 0 0-.968.053l-.466.46a.731.731 0 0 0-.053.98l3.188 3.935a.731.731 0 0 0 1.112.03l7.53-8.36a.731.731 0 0 0-.03-1.01l-.28-.277A.731.731 0 0 0 11.34.69L4.544 6.685z"/></svg>',
	highlights: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 13"><path fill="#FFF" fill-rule="evenodd" d="M3.332 8.768l2.172 2.171-1.702 1.702a.366.366 0 0 1-.26.107l-1.245-.002a.366.366 0 0 1-.257-.107l-1.032-1.03a.366.366 0 0 1 0-.516l2.324-2.325zm.455-1.41l6.31-6.309a.731.731 0 0 1 1.034 0l2.068 2.068a.731.731 0 0 1 0 1.035l-6.31 6.31a.731.731 0 0 1-1.034 0l-2.068-2.07a.731.731 0 0 1 0-1.033z"/></svg>',
	notes: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 10"><path fill="#FFF" fill-rule="evenodd" d="M6.262 9.233V7.017H8.48v-.554H5.986a.278.278 0 0 0-.278.277v2.493H1.277a.556.556 0 0 1-.556-.555V.922c0-.307.249-.555.556-.555h6.646c.307 0 .556.248.556.555v6.095L6.265 9.233h-.003zM7.371 3.97a.277.277 0 0 0-.277-.277H2.106a.277.277 0 1 0 0 .554h4.988a.277.277 0 0 0 .277-.277zm0-1.663a.277.277 0 0 0-.277-.277H2.106a.277.277 0 1 0 0 .554h4.988a.277.277 0 0 0 .277-.277z"/></svg>',
	images: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 15"><path fill="#FFF" fill-rule="evenodd" d="M8.546 8.793L6.668 5.337a.417.417 0 0 0-.733 0l-3.634 6.686a.417.417 0 0 0 .366.615h9.3a.417.417 0 0 0 .356-.634L9.806 7.896a.417.417 0 0 0-.71 0l-.55.897zM1.41.925H13.04c.46 0 .834.373.834.834V13.39c0 .46-.373.834-.834.834H1.41a.834.834 0 0 1-.834-.834V1.76c0-.46.373-.834.834-.834zm9.557 4.156a1.247 1.247 0 1 0 0-2.494 1.247 1.247 0 0 0 0 2.494z"/></svg>',
	badges: '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.55 16.57"><defs><style>.cls-1{fill:none;}.cls-2{fill:#fff;}</style></defs><title>badge</title><path class="cls-1" d="M5.24,7.2H5.12a4,4,0,1,0,.12,0Zm.06,6.93a2.95,2.95,0,1,1,2.95-2.95A2.95,2.95,0,0,1,5.3,14.13Z"/><path class="cls-2" d="M6.6,6.41,9.83,4.53a1,1,0,0,0,.48-.94c0-.63,0-1.83,0-2.47S9.76.18,9.19.18h-8c-.55,0-.87.64-.87,1s0,2.47,0,2.47a1,1,0,0,0,.45.87l3.1,1.82.1.07a5,5,0,1,0,2.63,0ZM5.24,15.23a4,4,0,0,1-.12-8h.12a4,4,0,1,1,0,8Z"/><circle class="cls-2" cx="5.3" cy="11.19" r="2.95"/></svg>',
	bookmarks: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9"><path fill="#FFF" fill-rule="evenodd" d="M1.335.283h6.53c.345 0 .625.28.625.626v7.726a.313.313 0 0 1-.468.271L4.929 7.13a.625.625 0 0 0-.62-.001l-3.132 1.78a.313.313 0 0 1-.467-.271V.908c0-.345.28-.625.625-.625z"/></svg>',
	friendships: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9"><path fill="#FFF" fill-rule="evenodd" d="M8.642 4.014S8.405 5.44 6.829 5.42a1.733 1.733 0 0 1-1.782-1.415l-.155-1.048S4.707 1.135 6.386.891c0 0 .35-.051.762 0 .462.057 1.37.152 1.617 1.414 0 0 .052.326.031.62-.052.758-.154 1.09-.154 1.09zm-4.534.983s-.16 1.035-1.223 1.02C1.823 6.002 1.684 4.99 1.684 4.99l-.104-.762s-.125-1.323 1.007-1.5c0 0 .236-.038.514 0 .31.04.924.11 1.09 1.027 0 0 .035.237.021.451-.036.55-.104.792-.104.792zm2.671.884c2.182 0 3.48.682 3.894 2.046a.556.556 0 0 1-.531.718l-6.626.003a.556.556 0 0 1-.54-.687c.338-1.387 1.606-2.08 3.803-2.08zM2.705 8.65H.88a.556.556 0 0 1-.52-.753C.664 7.099 1.56 6.7 3.054 6.7c-.59.598-.902 1.473-.348 1.949z"/></svg>',
	perfect_weeks: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 30"><path fill="#FFF" fill-rule="evenodd" d="M16.128 24.692L9.96 29.737a.966.966 0 0 1-1.576-.788l.322-7.637-7.875-1.39a.966.966 0 0 1-.383-1.744l6.425-4.46-3.756-6.682a.966.966 0 0 1 1.081-1.408l7.811 1.999L15.25.554a.966.966 0 0 1 1.756 0l3.24 7.073 7.812-2a.966.966 0 0 1 1.081 1.41l-3.756 6.68 6.425 4.461a.966.966 0 0 1-.383 1.744l-7.875 1.39.322 7.637a.966.966 0 0 1-1.576.788l-6.168-5.045z"/></svg>'
}

const DefaultMomentData = {
	plan_completions: 0,
	highlights: 0,
	notes: 0,
	images: 0,
	badges: 0,
	bookmarks: 0,
	friendships: 0,
	days_in_app: 0,
	perfect_weeks: 0,
}

class Icon {
	constructor(svgString, w, h, data = null) {
		this.svgString = svgString;
		this.width = w;
		this.height = h;
		this.canvas = createCanvas(w, h);
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
	constructor(size, localeData) {
		this.size = size;
		this.width = size;
		this.height = size;
		this.widthRightPane = this.width * 0.375;
		this.widthLeftPane = this.width * 0.625;

		this.fontSize = this.relativeFontSize();
		this._canvas = createCanvas(size, size);
		this.ctx = this._canvas.getContext('2d');

		this.localeData = localeData;

		this.translationStrings = {
			plan_completions: this.translate('plan days'),
			highlights: this.translate('profile menu.highlights'),
			notes: this.translate('profile menu.notes'),
			images: this.translate('profile menu.images'),
			badges: this.translate('profile menu.badges'),
			bookmarks: this.translate('profile menu.bookmarks'),
			friendships: this.translate('new friends'),
			my_year: this.translate('my year'),
			days_in_app: this.translate('days in app'),
			perfect_weeks: this.translate('perfect weeks'),
		}
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
	set momentData(data = {}) { this._momentData = Object.assign({}, DefaultMomentData, data); }

	get hasPerfectWeeks() { return this.momentData.perfect_weeks > 0; }
	get usableStats() {
		return OrderedStatNames.filter(stat => this.momentData[stat] !== 0);
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

	drawLeftPane() {
		const ctx = this.ctx;
		ctx.fillStyle = Colors.lightGrey;
		ctx.fillRect(0, 0, this.canvas.width - this.widthRightPane, this.canvas.height);
	}

	drawRightPane() {
		const ctx = this.ctx;
		const rightGradient = ctx.createLinearGradient(this.widthLeftPane, 0, this.widthLeftPane, this.height);
		rightGradient.addColorStop(0, 'rgba(23, 218, 214, 0.75)');
		rightGradient.addColorStop(0.5, 'rgba(33, 136, 179, 0.75)');
		rightGradient.addColorStop(1, 'rgba(43, 56, 144, 0.75)');

		const picture = new Image(this.width, this.height);
		picture.src = this.avatarData;

		const imageCanvas = createCanvas(this.width, this.height);
		const ictx = imageCanvas.getContext('2d');

		ictx.drawImage(picture, this.width * 0.3, 0, this.width, this.height);

		StackBlur.canvasRGB(imageCanvas, 0, 0, this.width, this.height, 20);
		ctx.drawImage(imageCanvas, 0, 0, this.width, this.height);

		ctx.fillStyle = rightGradient;
		ctx.fillRect(this.widthLeftPane, 0, this.widthRightPane, this.canvas.height);
	}

	drawHeadingText() {
		// My Year in the Bible App
		const ctx = this.ctx;
		const headerString = this.translationStrings.my_year.toUpperCase(); // upcase here to make sure text measurements are correct later
		let headerSizeMod = getLocaleSize(this.locale, 'my_year');

		ctx.font = this.fontStyle({ sizeModifier: headerSizeMod, font: 'Futura PT Cond Medium' });
		ctx.fillStyle = Colors.medGrey;

		const headerTextW = ctx.measureText(headerString).width;
		const headerX = this.relativeX(0.5, this.widthLeftPane) - (headerTextW / 2);
		ctx.fillText(headerString, headerX, this.relativeY(0.15));
	}

	drawPerfectWeeks() {

		// setup gradient based off pill size first.
		const ctx = this.ctx;
		const pillX = this.relativeX(0.15, this.widthLeftPane);
		const pillY = this.relativeY(0.72);
		const pillW = this.relativeW(0.70, this.widthLeftPane);
		const pillH = this.relativeH(0.070);
		const pillRadius = this.relativeH(0.55, pillH);
		const gradient = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY + pillH);
		gradient.addColorStop(0, '#2b3890');
		gradient.addColorStop(0.5, '#2188b3');
		gradient.addColorStop(1, '#17dad6');

		this.horizontalGradient = gradient;

		if (!this.hasPerfectWeeks) return;

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

		ctx.font = this.fontStyle({
			sizeModifier: getLocaleSize(this.locale, 'perfect_weeks'),
			font: 'Futura PT Cond Medium'
		});
		ctx.fillStyle = Colors.white;

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
		textY = pillY + (pillH / 1.5);
		ctx.fillText(pillString, textX, textY);


		iconX = textX + textW + iconW;
		iconY = textY - (iconH / 3);
		this.drawIcon(
			new Icon(Svgs.perfect_weeks, iconW, iconH),
			iconX,
			iconY
		);


		statX = iconX + (iconW);
		statY = textY;
		ctx.font = this.fontStyle({ bold: true, sizeModifier: 0.50 });
		ctx.fillText(statString, statX, statY);
	}


	drawDaysInApp() {
		const ctx = this.ctx;
		const daysString = this.translationStrings.days_in_app.toUpperCase(); // upcase here to make sure text measurements are correct later
		const daysStringY = this.hasPerfectWeeks ? this.relativeY(0.67) : this.relativeY(0.787);
		const localeSizeModifier = getLocaleSize(this.locale, 'days_in_app');
		const overallModifier = localeSizeModifier * (this.hasPerfectWeeks ? 1 : 1.15);


		ctx.fillStyle = this.horizontalGradient;
		ctx.font = this.fontStyle({
			bold: true,
			sizeModifier: overallModifier
		});

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
		const dayNumString = this.momentData.days_in_app;
		const dayNumStringY = this.hasPerfectWeeks ? this.relativeY(0.6) : this.relativeY(0.678);

		ctx.font = this.fontStyle({
			bold: true,
			sizeModifier: this.hasPerfectWeeks ? 3.5 : 4.5,
			font: 'Futura PT Cond Extra Bold'
		});

		const dayNumStringW = ctx.measureText(dayNumString).width;
		const dayNumStringX = this.relativeX(0.5, this.widthLeftPane) - (dayNumStringW / 1.9);
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

		ctx.font = this.fontStyle({ sizeModifier: 0.35, font: 'Futura PT Light' });
		ctx.fillStyle = fontColor;
		ctx.fillText(
			text,
			this.relativeX(0.46, this.widthLeftPane),
			this.relativeY(0.91)
		);

		const img = new Image();
		img.src = this.appLogo;
		ctx.drawImage(
			img,
			Math.round(this.relativeX(0.31, this.widthLeftPane)),
			Math.round(this.relativeY(0.865)),
			Math.round(this.relativeW(0.07)),
			Math.round(this.relativeH(0.07))
		);
	}

	drawVerticalStats() {

		const statNames = this.usableStats;
		let yPositions = [];
		let sizeModifier = 0;
		let iconSize = 0;

		switch (statNames.length) {
			case 1:
				yPositions = [this.relativeY(0.42)];
				iconSize = this.relativeW(0.15);
				sizeModifier = 2.5
				break;
			case 2:
				yPositions = [this.relativeY(0.28), this.relativeY(0.65)];
				sizeModifier = 1.5
				iconSize = this.relativeW(0.08);
				break;
			case 3:
				yPositions = [this.relativeY(0.15), this.relativeY(0.45), this.relativeY(0.77)]
				sizeModifier = 1.4
				iconSize = this.relativeW(0.08);
				break;
			case 4:
				yPositions = [this.relativeY(0.125), this.relativeY(0.35), this.relativeY(0.59), this.relativeY(0.82)]
				sizeModifier = 1.2
				iconSize = this.relativeW(0.060);
				break;
			default:
				break;
		}

		statNames.forEach((statName, index) => {
			this.drawVerticalStat(
				this.translationStrings[statName],
				new Icon(
					Svgs[statName],
					iconSize,
					iconSize
				),
				this.momentData[statName],
				yPositions[index],
				sizeModifier
			)
		})
	}

	drawAllStats() {
		let beginStatY = 0;
		const totalStats = this.usableStats.length;
		const statH = 0.08;
		const iconSizes = {
			badges: this.relativeW(0.030),
			bookmarks: this.relativeW(0.027),
			friendships: this.relativeW(0.030),
			highlights: this.relativeH(0.030),
			images: this.relativeW(0.028),
			notes: this.relativeH(0.028),
			plan_completions: this.relativeW(0.030)
		}

		switch (totalStats) {
			case 5:
				beginStatY = 0.345;
				break;

			case 6:
				beginStatY = 0.32;
				break;

			case 7:
				beginStatY = 0.27;
				break;

			default:
				break;
		}

		this.usableStats.forEach((statName, index) => {
			const statY = (index === 0) ? beginStatY : (beginStatY + (statH * index));
			const drawSeparator = (index === totalStats - 1) ? false : true;
			this.drawStat(
				statName,
				this.translationStrings[statName],
				new Icon(
					Svgs[statName],
					iconSizes[statName],
					iconSizes[statName]
				),
				this.momentData[statName],
				this.relativeY(statY),
				drawSeparator
			)
		})
	}

	drawStats() {
		switch (this.usableStats.length) {
			case 0:
				return;

			case 1:
			case 2:
			case 3:
			case 4:
				this.drawVerticalStats();
				break;

			default:
				this.drawAllStats();
		}
	}

	render() {
		this.setupContext();
		this.drawRightPane();
		this.drawLeftPane();
		this.drawHeadingText();
		this.drawPerfectWeeks(); // sets up the horizontal gradient, should come before others using gradient
		this.drawDaysInApp();
		this.drawProfileImage();
		this.drawDays();
		this.drawAppLink();
		this.drawStats();
	}

	drawStat(statKey, statString, statIcon, statNum, statY, drawSeparator = true) {
		const ctx = this.ctx;
		const stringX = this.relativeX(1.05, this.widthLeftPane);
		const separatorX = this.relativeX(1.035, this.widthLeftPane);
		const numX = this.relativeX(0.93, this.width);
		const labelSizeMod = getLocaleSize(this.locale, statKey);

		// String to left (Plan, Highlight, etc)

		ctx.font = this.fontStyle({ sizeModifier: labelSizeMod, font: 'Futura PT Cond Medium' });
		ctx.fillStyle = Colors.white;
		ctx.fillText(
			statString.toUpperCase(),
			stringX,
			statY,
		);

		// Stat number to the right
		ctx.font = this.fontStyle({ sizeModifier: 0.45, font: 'Futura PT Cond Medium' });

		ctx.fillText(
			statNum,
			numX,
			statY,
		);

		this.drawIcon(
			statIcon,
			this.relativeX(0.89),
			statY - (statIcon.height / 3.1),
		);

		if (drawSeparator) {
			const lineY = statY + statIcon.height;
			const grd = ctx.createLinearGradient(separatorX, lineY, this.width, lineY);
			grd.addColorStop(0, 'rgba(255,255,255,0.35)');
			grd.addColorStop(1, 'rgba(255,255,255,0.35)');


			ctx.beginPath();
			ctx.moveTo(separatorX, lineY);
			ctx.lineTo(this.width, lineY);
			ctx.strokeStyle = grd;
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


		ctx.font = this.fontStyle({ font: 'Futura PT Cond Medium', sizeModifier: (textSizeModifier / 3.5) });
		ctx.fillStyle = Colors.white;
		stringW = ctx.measureText(statString).width;
		stringX = xPos - (stringW * 0.50);
		stringY = statY - (statIcon.height / 1.50);

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

		ctx.font = this.fontStyle({ font: 'Futura PT Cond Medium', sizeModifier: textSizeModifier / 1.2 });
		ctx.fillStyle = Colors.white;
		numW = ctx.measureText(statNum).width;

		ctx.fillText(
			statNum,
			xPos - (numW * 0.5),
			statY + (statIcon.height * 1.6),
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
		const text20 = '20';
		const text18 = '18';
		const startAngle = 0;
		const endAngle = Math.PI * 2;
		const circleRadius = this.relativeCircleSize(0.17);
		const imageSize = circleRadius * 2;
		const halfImageSize = imageSize / 2;
		const x = this.relativeX(0.50, this.widthLeftPane);
		const y = this.relativeY(0.28);
		const textY = this.relativeY(0.295);
		const ctx = this.ctx;


		// Draw avatar inside circle
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


		// 20 (     ) 18
		// 2018 Text around the profile pic
		ctx.font = this.fontStyle({ sizeModifier: 0.9, font: 'Futura PT Cond Medium' });
		ctx.fillStyle = this.horizontalGradient;

		ctx.fillText(
			text20,
			x - halfImageSize - ctx.measureText(text20).width - this.relativeW(0.027),
			textY
		);

		ctx.fillText(
			text18,
			x + halfImageSize + this.relativeW(0.025),
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
	}


	relativeFontSize() {
		return this.size * 0.08;
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

export { Snapshot };
