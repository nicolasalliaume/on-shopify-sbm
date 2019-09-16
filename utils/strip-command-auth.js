module.exports = function( command ) {
	const domain = command.d || command.domain;
	const apiKey = command.k || command.key || command.apiKey;
	const password = command.p || command.password;

	if ( !domain || !apiKey || !password ) {
		throw new Error( 
			`Missing authentication arguments.`.red 
			+ `\n👉  Must include -d <domain> -k <key> -p <password>`.blue
		);
	}

	return { domain, apiKey, password };
}