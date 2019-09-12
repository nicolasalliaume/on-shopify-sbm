const fs = require( 'fs' );
const { join } = require( 'path' );
const currentGitBranch = require( 'current-git-branch' );
const getMatchingTheme = require( '../utils/get-matching-theme' );
const readEnvFile = require( '../utils/read-env-file' );
const replaceInFile = require( '../utils/replace-in-file' );

module.exports = async function( command ) {
	const { content: env, path: envPath } = getEnv( command );
	if ( ! env ) {
		throw new Error( 
			`No .env file available with a SLATE_THEME_ID variable was found. `.red
			+ `Are you sure you're inside a Slate project?\n`.red
			+ `👉  You can also specify a .env file using --env <file>`.blue
		);
	}

	!command.silent && console.log( `Using env file at ${ envPath }`.gray );

	const branch = currentGitBranch();
	if ( ! branch ) {
		throw new Error( `Cannot read current branch. Are you inside a git repository?`.red );
	}

	!command.silent && console.log( `⌥  On branch ${ branch.bold.green }` );

	const theme = await getMatchingTheme( branch );
	if ( ! theme ) {
		throw new Error( `Cannot find theme match for branch "${ branch }"`.red );
	}

	!command.silent && console.log( 
		`🖌  Pointing to theme ${ theme.name.bold.green } (ID. ${ theme.id })...` 
	);

	replaceInFile( envPath, /SLATE_THEME_ID\s?=.*\s?\n?$/, `SLATE_THEME_ID=${ theme.id }\n` );

	!command.silent && console.log( 
		`✅  env file updated to point to theme ${ theme.name.bold } (ID. ${ theme.id })`.green );
}


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
