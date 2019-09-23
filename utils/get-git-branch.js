const git = require( 'simple-git' )( process.cwd() );

module.exports = () => {
	return new Promise( ( resolve, reject ) => {
		git.status( ( error, result ) => {
			if ( error ) {
				return reject( 
					`Cannot get repo status. ${ error.message || '' }`
				);
			}
			resolve( result.current );
		} );
	} )
}