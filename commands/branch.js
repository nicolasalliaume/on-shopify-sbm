const createGitBranch = require( '../utils/create-git-branch' );
const duplicateTheme = require( '../utils/duplicate-theme' );
const getMatchingTheme = require( '../utils/get-matching-theme' );

module.exports = async function( command ) {
	const branchName = command[ '__' ][ 1 ];
	if ( ! branchName ) {
		throw new Error( `You must specify a branch name as first argument`.red );
	}

	const devTheme = await getMatchingTheme( 'dev' );
	if ( ! devTheme ) {
		throw new Error( 
			`No theme "dev" was found in the store.`.red
			+ `\n👉 A theme called "dev" is needed to use as base theme `.blue
			+ `when creating new ones using Shopify SBM.`.blue 
		);
	}

	!command.silent && console.log(
		`Creating Shopify theme ${ branchName.bold.green } `
		+ `as a copy of ${ devTheme.name }...`
	);

	const newTheme = await duplicateTheme( devTheme.id, branchName );
	
	!command.silent && console.log( `✅  Theme ${ newTheme.name } created.`.green );

	!command.silent && console.log(
		`Creating git branch ${ branchName.bold.green }...`
	);

	createGitBranch( branchName );

	!command.silent && console.log(
		`✅  Created git branch ${ branchName.bold }`.green
	);
}