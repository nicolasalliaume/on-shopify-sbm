const fs = require( 'fs' );
const createGitBranch = require( '../utils/create-git-branch' );

module.exports = async function( command ) {
	!command.silent && console.log( `Creating SBM env file for store...` );

	const sbmEnvFileContent = getSbmEnvContent( command );
	fs.writeFileSync( './.env.sbm', sbmEnvFileContent, 'utf8' );

	!command.silent && console.log( `SBM env file created.` );

	// load new env variables
	require( 'dotenv' ).config( { path: './.env.sbm' } );
	
	const getMatchingTheme = require( '../utils/get-matching-theme' );

	let devTheme = await getMatchingTheme( 'dev' );
	if ( devTheme ) {
		!command.silent && console.log( `Theme ${ 'dev'.green } already exists on store.` );
	}
	else {
		!command.silent && console.log( `Duplicating ${ 'master'.green } theme on shop...` );

		const duplicateTheme = require( '../utils/duplicate-theme' );

		const masterTheme = await getMatchingTheme( 'master' );
		if ( ! masterTheme ) {
			throw new Error( 
				`No theme "master" was found in the store.`.red
				+ `\n👉 A theme called "master" is needed to use as base theme `.blue
				+ `when initializing Shopify SBM.`.blue 
			);
		}

		devTheme = await duplicateTheme( masterTheme.id, 'dev' );
		
		!command.silent && console.log( `Theme ${ devTheme.name.green } created.` );
	}

	!command.silent && console.log( `Updating Slate env variables...` );

	const envContent = getEnvContent( command, devTheme );
	fs.writeFileSync( './.env', envContent, 'utf8' );

	!command.silent && console.log( `Slate env variables updated.` );
	!command.silent && console.log( `Creating branch ${ 'dev'.green }...` );

	try {
		await createGitBranch( 'dev' );
		!command.silent && console.log( `Branch ${ 'dev'.green } created.` );
	}
	catch ( e ) {
		console.log( 
			`Error while creating dev branch: ${ e.message.red }. `
			+ `Dismiss this error if branch already exists.` 
		);
	}

	!command.silent && console.log( `✅  Shopify SBM initialized.`.green );
}


function getSbmEnvContent( command ) {
	const { domain, apiKey, password } = getAuthFromCommand( command );
	return `DOMAIN=${ domain }\nKEY=${ apiKey }\nPASSWORD=${ password }\n`;
}


function getEnvContent( command, devTheme ) {
	const { domain, apiKey, password } = getAuthFromCommand( command );
	return `SLATE_STORE=${ domain }\n\nSLATE_PASSWORD=${ password }\n\n`
		+ `SLATE_THEME_ID=${ devTheme.id }\n\nSLATE_IGNORE_FILES=config/settings_data.json`;
}


function getAuthFromCommand( command ) {
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