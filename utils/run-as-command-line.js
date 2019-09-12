const spawn = require( 'child_process' ).spawn;

module.exports = function( command, args, cwd = '' ) {
	return new Promise( ( resolve, reject ) => {
		const cmd = spawn( command, args, { cwd: cwd || process.cwd() } );
	    cmd.on( 'close', function( code ) {
			if ( code ) return reject( new Error( `Error code: ${ code }` ) );
			return resolve();
	    } );
	} );
}