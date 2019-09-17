const createGitBranch = require( '../utils/create-git-branch' );
const createTheme = require( '../utils/create-theme' );
const getMatchingTheme = require( '../utils/get-matching-theme' );
const syncTheme = require( '../utils/sync-theme' );

module.exports = async function( command ) {
	const branchName = command[ '__' ][ 1 ];
	if ( ! branchName ) {
		throw new Error( `You must specify a branch name as first argument`.red );
	}

	!command.silent && console.log(
		`Creating empty Shopify theme ${ branchName.bold.green }...`
	);

	const devTheme = await getMatchingTheme( 'dev' );
	if ( ! devTheme ) {
		throw new Error( 
			`There's no ${ 'dev'.bold } theme present in the store.`.red 
			+ `\nA dev theme is needed as base theme.`
		);
	}

	const newTheme = await createTheme( branchName );

	!command.silent && console.log( `Theme ${ newTheme.name } created.`.green );
	!command.silent && console.log( 
		`Copying asset config/settings_data.json from theme ${ devTheme.name.bold } `
		+ `to theme ${ newTheme.name.bold }...` 
	);

	await syncTheme( 
		devTheme.id, 
		newTheme.id, 
		[ 'assets/settings_data.json' ], 
		command.silent, 
		command.y 
	);

	!command.silent && console.log(
		`Creating git branch ${ branchName.bold.green }...`
	);

	await createGitBranch( branchName );

	!command.silent && console.log( `Created git branch ${ branchName.bold }`.green );

	!command.silent && console.log( 
		`Run ${ `yarn start`.gray } to upload the theme to Shopify and start working.`.blue 
	);
	!command.silent && console.log( `✅ Done` );
}