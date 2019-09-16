const git = require( 'simple-git' )( process.cwd() );

module.exports = function( name ) {
	return new Promise( ( resolve, reject ) => {
		git.branch( ( error, result ) => {
			if ( error ) {
				return reject( 
					`Error while checkint branch ${ name.green }: ${ error.message.red }` 
				);
			}
			return resolve( result.all.includes( name ) );
		} )
	} );
}
