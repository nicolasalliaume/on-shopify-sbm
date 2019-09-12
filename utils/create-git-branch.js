var spawn = require('child_process').spawn;

module.exports = function( name ) {
	return new Promise( ( resolve, reject ) => {
		var cmd = spawn( 'git', [ 'checkout', '-b', name ], { cwd: process.cwd() } );
	    cmd.on( 'close', function( code ) {
	      if ( code ) return reject( `git error ${ code }` );
	      return resolve();
	    } );
	} );
}