const runAsCommandLine = require( './run-as-command-line' );

module.exports = async ( name ) => {
	try {
		return await runAsCommandLine( 'git', [ 'checkout', name ] );
	}
	catch( e ) {
		throw new Error( `Cannot checkout branch ${ name.green }: ${ e.message.red }` );
	}
}