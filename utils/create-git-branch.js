const git = require( 'simple-git' )( process.cwd() );

module.exports = async function( name ) {
	return new Promise( ( resolve, reject ) => {
		git.checkout( name, ( error, result ) => {
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

module.exports( 'dev' ).then( console.log );