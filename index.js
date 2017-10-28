process.env.NODE_ENV = 'production'
global.app = require('aero')()
// const cookieSession = require('cookie-session')
const globalJSON = require('./global.json')
const locale = require('locale')
const bodyParser = require('body-parser')
const url = require('url')
const langRegex = new RegExp('^\\/+(' + require('./config.json').languages.join('|') + ')\\/*')


app.use((request, response, next) => {
	var hours = url.parse(request.url).pathname.match(/jpg$|png|mp4$/) ? 24 * 24 : 12;
	response.setHeader("Cache-Control", "public, max-age=" + (hours * 60 * 60));
	response.setHeader("Expires", new Date(Date.now() + (hours * 60 * 60 * 1000)).toUTCString());
	next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(cookieSession({
// 	name: 'session',
// 	keys: ['adex-key-1', 'adex-key-2']
// }))

// app.use((request, response, next) => {
// 	// Just to be safe
// 	if(!request.session)
// 		request.session = {}

// 	if(request.query && request.query.language !== undefined)
// 		request.session.language = request.query.language

// 	next()
// })

app.use((request, response, next) => {
	request.globals = globalJSON
	request.globals.gurl = url.parse(request.url, true);
	request.globals.nolangpath = request.globals.gurl.pathname;

	const supportedLanguages = new locale.Locales(app.config.languages);
	const acceptLocales = new locale.Locales(request.headers["accept-language"])
	let language = request.language || acceptLocales.best(supportedLanguages).toString().substring(0, 2)

	request.globals.languages = supportedLanguages
	request.globals.language = language
	request.globals.version = require('./package.json').version

	console.log('process.env.NODE_ENV', process.env.NODE_ENV)

	// Translate function
	request.globals.__ = languages => {
		if (typeof languages !== 'object')
			return languages

		let translation = languages[language] || languages.en

		if (translation === undefined)
			return '-'


		return translation
	}

	request.globals.strings = require('./data/strings.json')

	next()
})

app.use((request, response, next) => {
	let lang = request.globals.language;
	let whitepaperAddress = '/adex/'
	let youtubeUrl = ''

	switch (lang) {
		case 'cn':
			whitepaperAddress += 'AdEx-Whitepaper-v1.4%20-Cici-cleanV2.pdf'
			youtubeUrl = 'https://www.youtube.com/embed/Itm23uq2mC8?rel=0&amp;showinfo=0'
			break;
		case 'ru':
			whitepaperAddress += 'AdEx-Whitepaper-v.5.ru.pdf'
			youtubeUrl = 'https://www.youtube.com/embed/e1jAzl-qt-E?rel=0&amp;showinfo=0'			
			break;
		default:
			whitepaperAddress += 'AdEx-Whitepaper-v.7.pdf'
			youtubeUrl = 'https://www.youtube.com/embed/E4A0bcCQke0?rel=0&amp;showinfo=0'			
	}

	request.globals.youtubeUrl = youtubeUrl
	request.globals.whitepaperAddress = whitepaperAddress + '?v=' + request.globals.version
	request.globals.guideAddress = ('/adex/AdEx-Crowdsale-V2.pdf')
	request.globals.tosAddress = ('/adex/AdEx-Terms-and-Conditions-v.2.2.pdf')
	request.globals.tokensaleLink = ((lang ? '/' + lang : '') + '/tokens' + (request.globals.gurl.path || '/'))

	next()
})

app.rewrite((request, response) => {
	var path = url.parse(request.url, true).path;
	var language = null;

	let langMatch = langRegex.exec(path)
	if (langMatch && langMatch[1]) {
		language = langMatch[1];
		request.url = request.url.replace(langMatch[0], '/')
	}

	request.language = language;
})

require('./services/resources')

app.run()
