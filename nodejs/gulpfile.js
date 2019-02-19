/* eslint-disable no-console */
const gulp = require('gulp');
const https = require('https');
const yaml = require('js-yaml');
const fs = require('fs');
const async = require('async');
const langmap = require('langmap');
const langs = require('langs');

require('babel-register')({ presets: [ 'env', 'react' ], plugins: [ 'transform-object-rest-spread', 'transform-function-bind', 'transform-object-assign', 'transform-class-properties', 'syntax-dynamic-import' ] });

const getApiStrings = require('./localization').items
const poToJson = require('./localization').poToJson

const localeNameException = {
  af: 'af-ZA',
  be: 'be-BY',
  bg: 'bg-BG',
  bn: 'bn-IN',
  ca: 'ca-ES',
  ckb: 'ckb-IR',
  cs: 'cs-CZ',
  cy: 'cy-GB',
  da: 'da-DK',
  de: 'de-DE',
  el: 'el-GR',
  es: 'es-LA',
  et: 'et-EE',
  fa: 'fa-IR',
  fi: 'fi-FI',
  fil: 'tl-PH',
  fr: 'fr-FR',
  hi: 'hi-IN',
  hr: 'hr-HR',
  hu: 'hu-HU',
  hy: 'hy-AM',
  id: 'id-ID',
  it: 'it-IT',
  ja: 'ja-JP',
  km: 'km-KH',
  kn: 'kn-IN',
  ko: 'ko-KR',
  lt: 'lt-LT',
  lv: 'lv-LV',
  mk: 'mk-MK',
  ml: 'ml-IN',
  mr: 'mr-IN',
  ms: 'ms-MY',
  ne: 'ne-NP',
  nl: 'nl-NL',
  no: 'no-NO',
  pl: 'pl-PL',
  pt: 'pt-BR',
  ro: 'ro-RO',
  ru: 'ru-RU',
  sk: 'sk-SK',
  sq: 'sq-AL',
  sr: 'sr-CS',
  sv: 'sv-SE',
  ta: 'ta-IN',
  th: 'th-TH',
  tl: 'tl-PH',
  tr: 'tr-TR',
  uk: 'uk-UA',
  uz: 'uz-UZ',
  vi: 'vi-VN',
  zu: 'zu-ZA'
}

// Just set this to something because @youversion/js-api expects a value and will crash without it
process.env.YOUVERSION_TOKEN_PHRASE = 'just-a-test';

const CROWDIN_API_KEY = process.env.CROWDIN_API_KEY

const GetClient = require('@youversion/js-api').getClient;

const crowdinProjectId = 'biblecom';

const prefixedLocales = [
  'en-GB',
  'zh-CN',
  'zh-TW',
  'zh-HK',
  'es-ES',
  'pt-PT',
  'my-MM'
]

function crowdinFetchAvailableLocales(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.crowdin.com',
      port: 443,
      path: `/api/project/${crowdinProjectId}/status?key=${token}&json`,
      method: 'GET'
    }

    const req = https.request(options)

    req.on('response', (response) => {
			/* eslint-disable no-var */
      var body = '';

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (ex) {
          reject(ex);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  })
}

function crowdinFetchLocaleFile(locale, token) {
  return new Promise((resolve, reject) => {

		// console.log('Requesting locale file from Crowdin:', locale)

    const options = {
      hostname: 'api.crowdin.com',
      port: 443,
      path: `/api/project/${crowdinProjectId}/export-file?file=/master/ruby/config/locales/en.yml&format=yaml&language=${locale}&key=${token}`,
      method: 'GET'
    }

    const req = https.request(options)

    req.on('response', (response) => {
			/* eslint-disable no-var */
      var body = '';

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        try {
          resolve(yaml.safeLoad(body, { json: true }));
        } catch (ex) {
          reject(ex);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  })
}

/*eslint-disable */
function flattenObject(ob) {
	var toReturn = {};
	for (var i of Object.keys(ob)) {
		if ((typeof ob[i]) === 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				toReturn[`${i}.${x}`] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
}
/*eslint-enable*/

gulp.task('crowdin', () => {
  return crowdinFetchAvailableLocales(CROWDIN_API_KEY).then((response) => {
    const locales = response
    const queue = async.queue((task, callback) => {
      crowdinFetchLocaleFile(task.locale, CROWDIN_API_KEY).then((data) => {
        callback(task, data, null);
      }, (error) => {
        callback(null, null, error);
      })
    }, 10);

    const localeList = locales.map((item) => {
      const lang_country = item.code.split('-');
			// const country = lang_country[1] || '';
      const lang = langs.where('1', lang_country[0]);
      const locale3 = lang ? lang['3'] : null;
      const locale2 = lang ? lang['1'] : null;
      const final = Object.assign(
        {},
        langmap[item.code],
        {
          locale: item.code,
          locale2,
          locale3
        }
      );

      final.displayName = final.nativeName || final.englishName || final.locale.toUpperCase();
      return final;
    });

    localeList.push({
      nativeName: 'English (US)',
      englishName: 'English (US)',
      locale: 'en-US',
      locale2: 'en',
      locale3: 'eng',
      displayName: 'English (US)'
    });

    localeList.sort((a, b) => {
      return a.displayName.localeCompare(b.displayName);
    });

    // With the Smartling integration, we were writing this file as point of reference
    //  for copying/pasting into ./locales/config/localeList.json (no underscore)
    //  Removing this with Crowdin to prevent accidentally copying/pasting bad data into
    //  production file
		// fs.writeFileSync('./locales/config/_localeList.json', JSON.stringify(localeList, null, '\t'));

    const tasks = locales.map((item) => {
      return { locale: item.code, prefix: item.code.split('-')[0] }
    });

    tasks.push({ locale: 'en-US', prefix: 'en' });

    const availableLocales = {};
    tasks.forEach((t) => {
      availableLocales[t.locale] = t.locale;
      availableLocales[t.prefix] = t.locale;
      availableLocales[t.locale.replace('-', '_')] = t.locale
    });

    // With the Smartling integration, we were writing this file as point of reference
    //  for copying/pasting into ./locales/config/availableLocales.json (no underscore)
    //  Removing this with Crowdin to prevent accidentally copying/pasting bad data into
    //  production file
		// fs.writeFileSync('./locales/config/_availableLocales.json', JSON.stringify(availableLocales, null, '\t'));

    queue.push(tasks, (task, data) => {
      console.log('=== Got a response from Crowdin:', task.locale)

      if (!(typeof data === 'object')) {
        console.log(' !! Bad Response', data)
      }

      getApiStrings({
        language_tag: prefixedLocales.includes(task.locale)
						? task.locale.replace('-', '_')
						: task.prefix
      }).then((resp) => {

        console.log('=== Got a response from YV API:', task.locale, typeof resp === 'string')
        if (!(typeof resp === 'string')) {
          console.log(' !! Bad Response')
        }

				// the response is a bit odd, in that if we see we have a 'response'
				// key, it means we have an error. if we actually get the strings, they
				// are at the top level
        const localeExceptions = {
          myz: 'my-MM',
          'ml-IN': 'ml',
          'ne-NP': 'ne',
          'es-la': 'es',
					// 'es-ES': 'es',
          'sv-SE': 'sv',
          'en-US': false,
          'ur-PK': 'ur',
          fil: 'tl',
          'pt-BR': 'pt',
          'sr-CS': 'sr',
          'hy-AM': 'hy'
					// 'pt-PT': 'pt',
					// ckb: 'ckb-IR'
        }

        const localeKey = localeExceptions[task.locale] || task.locale

        let apiStrings = {}
        try {
          JSON.parse(resp)
        } catch (e) {
          apiStrings = poToJson(resp)
        }

        const strings = Object.assign(
						{},
						typeof data[localeKey] === 'undefined' ? {} : data[localeKey].EventsAdmin,
						apiStrings
					)

        if (typeof data[localeKey] === 'undefined') {
          console.log('ERROR', localeKey, Object.keys(data))
        }

        const fileName = (['es', 'pt'].indexOf(localeKey) > -1) ? task.locale : (localeNameException[localeKey] || localeKey)

        fs.writeFileSync(
						`./locales/${fileName}.json`,
						JSON.stringify(flattenObject(strings), null, '\t')
						.replace(/\%\{/g, '{')
					);
      })
    });

    GetClient('reading-plans')
      .call('configuration')
      .setVersion('3.1')
      .get()
      .then((data) => {
        const planLocales = {}

        const isFullMatch = (locale, planLocale) => {
          return locale.replace('-', '_') === planLocale.replace('-', '_')
        }

        const isOverride = (locale, planLocale) => {
          return (isFullMatch('pt-PT', locale) && isFullMatch('pt', planLocale)) || (isFullMatch('es-ES', locale) && isFullMatch('es', planLocale))
        }

        const isPrefixMatch = (locale, planLocale) => {
          return planLocale.length === 2 &&
          !isOverride(locale, planLocale) &&
          (locale.split('-')[0].split('_')[0] === planLocale.split('-')[0].split('_')[0])
        }

        const mergeLocale = (final, locale, planLocale) => {
          if (isFullMatch(locale, planLocale) || isPrefixMatch(locale, planLocale)) {
            final[locale] = planLocale
          }
        }

        data.available_language_tags.forEach((l) => {
          Object.keys(availableLocales).forEach((a) => {
            mergeLocale(planLocales, a, l)
          });
        });

	// fs.writeFileSync('./locales/config/planLocales.json', JSON.stringify(planLocales, null, '\t'));

      }, (error) => {
        console.log(error);
      });

  }, (error) => {
    console.log(error);
  });
});
