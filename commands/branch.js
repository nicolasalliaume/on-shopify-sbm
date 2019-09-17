const createGitBranch = require( '../utils/create-git-branch' );
const createTheme = require( '../utils/create-theme' );

module.exports = async function( command ) {
	const branchName = command[ '__' ][ 1 ];
	if ( ! branchName ) {
		throw new Error( `You must specify a branch name as first argument`.red );
	}

	!command.silent && console.log(
		`Creating empty Shopify theme ${ branchName.bold.green }...`
	);

	const newTheme = await createTheme( branchName );

	!command.silent && console.log( `Theme ${ newTheme.name } created.`.green );

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