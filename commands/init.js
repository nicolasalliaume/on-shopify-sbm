const createGitBranch = require( '../utils/create-git-branch' );
const stripCommandAuth = require( '../utils/strip-command-auth' );
const createSBMEnv = require( '../utils/create-sbm-env' );
const createSlateEnv = require( '../utils/create-slate-env' );

module.exports = async function( command ) {
	createAuthenticationFile( command );

	// load new env variables
	require( 'dotenv' ).config( { path: './.env.sbm' } );

	const masterTheme = await createMasterThemeIfNeeded();
	const devTheme = await createDevThemeIfNeeded();

	createSlateEnvFile( command, devTheme.id );

	createAndCheckoutDevBranch( command );
	
	!command.silent && console.log( `✅  Shopify SBM initialized.`.green );
}


function createAuthenticationFile( command ) {
	!command.silent && console.log( `Creating SBM env file for store...` );
	createSBMEnv( stripCommandAuth( command ) );
	!command.silent && console.log( `SBM env file created.` );
}


function createSlateEnvFile( command, devThemeId ) {
	!command.silent && console.log( `Updating Slate env variables...` );
	const { domain, password } = stripCommandAuth( command );
	createSlateEnv( domain, password, devThemeId );
	!command.silent && console.log( `Slate env variables updated.` );
}

function createMasterThemeIfNeeded() {
	return createThemeIfNotExists( 'master' );
}

function createDevThemeIfNeeded() {
	return createThemeIfNotExists( 'dev' );
}

async function createThemeIfNotExists( themeName ) {
	const getMatchingTheme = require( '../utils/get-matching-theme' );
	let theme = await getMatchingTheme( themeName );
	if ( theme ) {
		return theme;
	}
	const createTheme = require( '../utils/create-theme' );
	return createTheme( themeName );
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
