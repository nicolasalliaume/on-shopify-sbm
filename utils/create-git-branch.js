const runAsCommandLine = require( './run-as-command-line' );

module.exports = async ( name ) => {
	try {
		return await runAsCommandLine( 'git', [ 'checkout', '-b', name ] );
	}
	catch( e ) {
		throw new Error( `Cannot create branch ${ name.green }: ${ e.message.red }` );
	}
}