
let config = {
	'secret': 'vueMallRestFulWithHerec',//userd when we create and verify JSON Web Tokens
	'database': 'mongodb://127.0.0.1:27017/mall',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
		    secure: false,
		    maxAge: 365 * 24 * 60 * 60 * 1000,
		}
	}
}

if (process.env.NODE_ENV == "stage") {
	config.database = "mongodb://127.0.0.1:27017/mall"
}

export default config