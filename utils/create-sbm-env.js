const fs = require( 'fs' );

module.exports = function( domain, apiKey, password, output = './.env.sbm' ) {
	const content = `DOMAIN=${ domain }\nKEY=${ apiKey }\nPASSWORD=${ password }\n`;
	return fs.writeFileSync( output, content, 'utf8' );
}