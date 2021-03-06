const git = require( 'simple-git' )( process.cwd() );
const branchExists = require( './branch-exists' );
const checkoutBranch = require( './checkout-git-branch' );

module.exports = async function( name, sourceBranch = 'dev' ) {
	const exists = await branchExists( name );

	if ( exists ) {
		return checkoutBranch( name );
	}

	return new Promise( ( resolve, reject ) => {
		git.checkoutBranch( name, sourceBranch, ( error, result ) => {
			if ( error ) {
				return reject( 
					`Cannot create branch ${ name.green }.` 
				);
			}
			resolve();
		} );
	} )
}