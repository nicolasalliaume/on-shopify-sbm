const fs = require( 'fs' );

module.exports = function( domain, password, devThemeId, output = './.env' ) {
	const content = `SLATE_STORE=${ domain }\n\nSLATE_PASSWORD=${ password }\n\n`
		+ `SLATE_THEME_ID=${ devThemeId }\n\nSLATE_IGNORE_FILES=config/settings_data.json`;
	return fs.writeFileSync( output, content, 'utf8' );
}