const Command = require( './command' );
const fs = require( 'fs' );
const { join } = require( 'path' );
const currentGitBranch = require( 'current-git-branch' );
const readEnvFile = require( '../utils/read-env-file' );
const replaceInFile = require( '../utils/replace-in-file' );


class SetCommand extends Command {

	async execute() {
		const { env, envPath } = this.getEnvOrThrow();
		this.branch = await this.getCurrentBranchOrThrow();
		this.theme = await this.getThemeOrThrow( 
			this.branch, 
			`Cannot find theme match for branch "${ this.branch }"`.red 
		);
		return this.setSlateThemeId( envPath, this.theme );
	}


	getEnvOrThrow() {
		const { content: env, path: envPath } = getEnv( this.command );
		if ( ! env ) {
			throw new Error( 
				`No .env file available with a SLATE_THEME_ID variable was found. `.red
				+ `Are you sure you're inside a Slate project?\n`.red
				+ `👉  You can also specify a .env file using --env <file>`.blue
			);
		}
		this.reporter.info( `Using env file at ${ envPath }`.gray );
		return { env, envPath };
	}


	async getCurrentBranchOrThrow() {
		const branch = await currentGitBranch();
		if ( ! branch ) {
			throw new Error( `Cannot read current branch. Are you inside a git repository?`.red );
		}
		this.reporter.info( `⌥  On branch ${ branch.bold.green }` );
		return branch;
	}


	async setSlateThemeId( envPath, theme ) {
		this.reporter.info( `🖌  Pointing to theme ${ theme.name.bold.green } (ID. ${ theme.id })...` );
		await replaceInFile( envPath, /SLATE_THEME_ID=(.*)/, `SLATE_THEME_ID=${ theme.id }\n` );
		this.reporter.info( 
			`✅  env file updated to point to theme ${ theme.name.bold } `
			+ `(ID. ${ theme.id })`.green 
		);
	}
}

module.exports = SetCommand;



/**
 * Looks for the first available env file to set the
 * slate theme id variable.
 *
 * Returns env variables as an object.
 * 
 * @param  {Object} command 
 * @return {Object}  { env: <contents>, path: <string path> }
 */
function getEnv( command ) {
	const pathOptions = [];

	// command-set env
	if ( command.env ) pathOptions.push( command.env );
	
	// fallback
	pathOptions.push( join( process.cwd(), '.env' ) );
	
	for ( var i = 0; i < pathOptions.length; i++ ) {
		const path = pathOptions[ i ];
		if ( fs.existsSync( path ) ) {
			const env = readEnvFile( path );
			if ( env[ 'SLATE_THEME_ID' ] !== undefined ) {
				return { content: env, path };
			}
		}
	}

	return null;
}
