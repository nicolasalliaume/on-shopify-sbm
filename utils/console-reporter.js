const Reporter = require( './reporter' );

module.exports = class ConsoleReporter extends Reporter {

	info( message ) {
		console.log( message );
	}

	error( error ) {
		console.error( error );
	}

	warning( message ) {
		console.warn( message );
	}
}