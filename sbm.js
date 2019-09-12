const colors = require( 'colors' );
const parseCommand = require( 'js-command-parser' );

module.exports = async function() {

	const command = parseCommand( [ ...process.argv ].splice( 2 ) );

	if ( ! command[ '__' ] ) {
		throw new Error( `Command not specified`.red );
	}

	const action = command[ '__' ][ 0 ].toLowerCase();

	switch ( action ) {

		case 'branch': return require( './commands/branch' )( command );

		case 'set': return require( './commands/set' )( command );

		default: throw new Error( `Unknown command ${ action }`.red );

	}
}