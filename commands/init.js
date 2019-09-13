const fs = require( 'fs' );
const createGitBranch = require( '../utils/create-git-branch' );
const duplicateTheme = require( '../utils/duplicate-theme' );
const getMatchingTheme = require( '../utils/get-matching-theme' );


module.exports = async function( command ) {
	!command.silent && console.log( `Creating SBM env file for store...` );

	const envContent = getEnvContent( command );
	fs.writeFileSync( './.env.sbm', envContent, 'utf8' );

	!command.silent && console.log( `SBM env file created.` );
	!command.silent && console.log( `Duplicating ${ 'master'.green } theme on shop...` );

	const masterTheme = await getMatchingTheme( 'master' );
	if ( ! masterTheme ) {
		throw new Error( 
			`No theme "master" was found in the store.`.red
			+ `\n👉 A theme called "master" is needed to use as base theme `.blue
			+ `when initializing Shopify SBM.`.blue 
		);
	}

	const devTheme = await duplicateTheme( masterTheme.id, 'dev' );
	
	!command.silent && console.log( `Theme ${ devTheme.name.green } created.` );
	!command.silent && console.log( `Creating branch ${ 'dev'.green }...` );

	createGitBranch( 'dev' );

	!command.silent && console.log( `Branch ${ 'dev'.green } created.` );
	!command.silent && console.log( `✅  Shopify SBM initialized.`.green );
}


function getEnvContent( command ) {
	const domain = command.d || command.domain;
	const apiKey = command.k || command.key || command.apiKey;
	const password = command.p || command.password;

	if ( !domain || !apiKey || !password ) {
		throw new Error( 
			`Missing authentication arguments.`.red 
			+ `\n👉  Must include -d <domain> -k <key> -p <password>`.blue
		);
	}

	return `DOMAIN=${ domain }\nKEY=${ apiKey }\nPASSWORD=${ password }\n`;
}