const colors = require( 'colors' );
const parseCommand = require( 'js-command-parser' );

module.exports = async function() {

	const command = parseCommand( [ ...process.argv ].splice( 2 ) );

	if ( ! command[ '__' ] ) {
		throw new Error( `Command not specified`.red );
	}

	const reporter = buildReporter( command );
	const action = command[ '__' ][ 0 ].toLowerCase();

	let Command;

	switch ( action ) {

		case 'branch':
		case 'flow': { 
			Command = require( './commands/branch' );
			break;
		}

		case 'set': 
		case 'set-branch':
		case 'set-theme': {
			Command = require( './commands/set' );
			break;
		}

		case 'init': {
			Command = require( './commands/init' );
			break;
		}

		case 'publish': {
			Command = require( './commands/publish' );
			break;
		}

		default: throw new Error( `Unknown command ${ action }`.red );
	}

	return new Command( command, reporter ).execute();
}


const buildReporter = command => {
	let Reporter;
	if ( command.silent ) {
		Reporter = require( './utils/reporter' );
	}
	Reporter = require( './utils/console-reporter' );
	return new Reporter();
}