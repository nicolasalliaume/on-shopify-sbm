const git = require( 'simple-git' )( process.cwd() );

module.exports = function( name ) {
	return new Promise( ( resolve, reject ) => {
		git.checkout( name, ( error ) => {
			if ( error ) {
				return reject( 
					`Cannot checkout branch ${ name.green }: ${ error.message.red }` 
				);
			}
			resolve();
		} );
	} )
}