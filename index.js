global.app = require('aero')()
// const cookieSession = require('cookie-session')
const globalJSON = require('./global.json')
const locale = require('locale')
const bodyParser = require('body-parser')
const url = require('url')

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
	let language = acceptLocales.best(supportedLanguages).toString().substring(0, 2)

	// if(!request.session.language) {		
	// 	const acceptLocales = new locale.Locales(request.headers["accept-language"])
	// 	request.session.language = acceptLocales.best(supportedLanguages).toString().substring(0, 2)
	// }

	// Temp
	let langRegex = new RegExp('\\/(' + app.config.languages.join('|') + ')$')
	let langMatch = langRegex.exec(request.globals.gurl.pathname)
	if(langMatch && langMatch[1]) {
		language = langMatch[1];
		request.globals.nolangpath = request.globals.nolangpath.replace(langMatch[0], '')
	}

	request.globals.languages = supportedLanguages
	request.globals.language = language
	request.globals.version = require('./package.json').version

	// Translate function
	request.globals.__ = languages => {
		if(typeof languages !== 'object')
			return languages

		let translation = languages[language] || languages.en 

		if(translation === undefined)
			return '-'


		return translation
	}

	request.globals.strings = require('./data/strings.json')

	next()
})

app.use((request, response, next) => {
	var lang = request.globals.language || 'en';

	request.globals.whitepaperAddress = (lang === "cn" ? "/adex/AdEx-Whitepaper-v1.4%20-Cici-cleanV2.pdf" : "/adex/AdEx-Whitepaper-v.7.pdf")
	request.globals.guideAddress = ("/adex/AdEx-Crowdsale-V2.pdf")
	request.globals.tosAddress = ("/adex/AdEx-Terms-and-Conditions-v.2.2.pdf")
	request.globals.tokensaleLink = ("/tokens" + (request.globals.gurl.path || "/"))

	next()
})

require('./services/resources')

app.run()
