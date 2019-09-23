const createGitBranch = require( '../utils/create-git-branch' );
const stripCommandAuth = require( '../utils/strip-command-auth' );
const createSBMEnv = require( '../utils/create-sbm-env' );
const createSlateEnv = require( '../utils/create-slate-env' );

module.exports = async function( command ) {
	createAuthenticationFile( command );

	// load new env variables
	require( 'dotenv' ).config( { path: './.env.sbm' } );

	const masterTheme = await createMasterThemeIfNeeded( command );
	const devTheme = await createDevThemeIfNeeded( command );

	createSlateEnvFile( command, devTheme.id );

	await createAndCheckoutDevBranch( command );
	
	!command.silent && console.log( `✅  Shopify SBM initialized.`.green );
}


function createAuthenticationFile( command ) {
	!command.silent && console.log( `Creating SBM env file for store...` );
	const { domain, apiKey, password } = stripCommandAuth( command )
	createSBMEnv( domain, apiKey, password );
	!command.silent && console.log( `SBM env file created.` );
}


function createSlateEnvFile( command, devThemeId ) {
	!command.silent && console.log( `Updating Slate env variables...` );
	const { domain, password } = stripCommandAuth( command );
	createSlateEnv( domain, password, devThemeId );
	!command.silent && console.log( `Slate env variables updated.` );
}

function createMasterThemeIfNeeded( command ) {
	return createThemeIfNotExists( 'master', command );
}

function createDevThemeIfNeeded( command ) {
	return createThemeIfNotExists( 'dev', command );
}

async function createThemeIfNotExists( themeName, command ) {
	!command.silent && console.log( `Creating theme ${ themeName.green }...` );
	const getMatchingTheme = require( '../utils/get-theme-by-name' );
	let theme = await getMatchingTheme( themeName );
	if ( theme ) {
		!command.silent && console.log( `Skipped. Theme ${ themeName.green } already exists.` );
		return theme;
	}
	const createTheme = require( '../utils/create-theme' );
	theme = await createTheme( themeName );
	!command.silent && console.log( `Theme ${ themeName.green } created.` );
	return theme;
}

async function createAndCheckoutDevBranch( command ) {
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
}
