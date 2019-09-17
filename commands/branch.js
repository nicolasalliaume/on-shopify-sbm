const createGitBranch = require( '../utils/create-git-branch' );
const createTheme = require( '../utils/create-theme' );
const getMatchingTheme = require( '../utils/get-matching-theme' );
const syncTheme = require( '../utils/sync-theme' );
const promptUser = require( 'command-prompt-user' );

module.exports = async function( command ) {
	const branchName = command[ '__' ][ 1 ];
	if ( ! branchName ) {
		throw new Error( `You must specify a branch name as first argument`.red );
	}

	!command.silent && console.log(
		`Creating empty Shopify theme ${ branchName.bold.green }...`
	);

	const devTheme = await getThemeOrThrow( 'dev' );

	let newTheme = await getMatchingTheme( branchName );
	if ( newTheme || !command.y ) {
		const shouldContinue = promptUser( `Theme ${ newTheme.name.bold } already exists. Continue anyway?` );
		if ( shouldContinue.toLowerCase() !== 'y' ) {
			throw new Error( `Cancelled by user.` );
		}
		!command.silent && console.log( `Continuing...` );
	}
	else {
		newTheme = await createTheme( branchName );
		!command.silent && console.log( `Theme ${ newTheme.name.bold } created.`.green );
	}

	const assetsToCopy = [ 'config/settings_data.json' ];

	!command.silent && console.log( 
		`Copying assets from theme ${ devTheme.name.bold } to theme ${ newTheme.name.bold }...`
		+ `\n\t* ` + assetsToCopy.join( '\n\t* ' )
	);

	await syncTheme( devTheme.id, newTheme.id, assetsToCopy, command.silent, command.y );

	!command.silent && console.log(
		`Creating git branch ${ branchName.bold.green }...`
	);

	await createGitBranch( branchName, 'dev' );

	!command.silent && console.log( `Created git branch ${ branchName.bold }`.green );

	!command.silent && console.log( 
		`Run ${ `yarn start`.gray } to upload the theme to Shopify and start working.`.blue 
	);

	!command.silent && console.log( `✅ Done` );
}


async function getThemeOrThrow( name ) {
	const devTheme = await getMatchingTheme( name );
	if ( ! devTheme ) {
		throw new Error( `There's no ${ name.bold } theme present in the store.`.red );
	}
	return devTheme;
}

