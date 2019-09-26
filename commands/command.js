const getMatchingTheme = require( '../utils/get-theme-by-name' );
const promptUser = require( 'command-prompt-user' );
const selectTheme = require( '../utils/select-theme' );

module.exports = class Command {

	constructor( command, reporter ) {
		this.command = command;
		this.reporter = reporter;
	}

	execute() {
		throw new Error( `Must implement execute() method` );
	}

	getArgument( position, name ) {
		return this.command[ '__' ][ position ] || this.command[ name ];
	}

	getArgumentOrThrow( argumentPosition, errorMessage ) {
		const argValue = this.getArgument( argumentPosition );
		if ( ! argValue ) {
			throw new Error( errorMessage || `Missing argument ${argumentPosition}.` );
		}
		return argValue;
	}

	async getThemeOrThrow( themeName, errorMessage ) {
		const theme = await getMatchingTheme( themeName );
		if ( ! theme ) {
			throw new Error( 
				errorMessage || `There's no ${ themeName.bold } theme present in the store.`.red 
			);
		}
		return theme;
	}

	continueOrThrow( promptMessage, throwMessage ) {
		const shouldContinue = promptUser( promptMessage );
		if ( shouldContinue.toLowerCase() !== 'y' ) {
			throw new Error( throwMessage || `Cancelled by user.` );
		}
	}

	async selectThemeOrThrow( promptMessage, errorMessage ) {
		const themeName = await selectTheme( promptMessage || 'Select a theme' );
		if ( ! themeName ) {
			throw new Error( errorMessage || 'You must select a theme.' );
		}
		return themeName;
	}
}