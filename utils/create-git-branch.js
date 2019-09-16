const git = require( 'simple-git' )( process.cwd() );
const branchExists = require( './branch-exists' );
const checkoutBranch = require( './checkout-git-branch' );

module.exports = async function( name ) {
	const exists = await branchExists( name );

	if ( exists ) {
		return checkoutBranch( name );
	}

	return new Promise( ( resolve, reject ) => {
		git.checkoutBranch( name, 'master', ( error, result ) => {
			if ( error ) {
				return reject( 
					`Cannot create branch ${ name.green }: ${ error.message.red }` 
				);
			}
			console.log( result );
			resolve();
		} );
	} )
}