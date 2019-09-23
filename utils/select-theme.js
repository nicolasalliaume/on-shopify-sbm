const getThemeList = require( './get-themes' );
const promptUser = require( 'command-prompt-user' );

module.exports = async function( message = 'Choose a theme' ) {
	const themes = await getThemeList();
	const themesList = themes.map( ( t, index ) => `  ${ index + 1 }) ${ t.name }\n` ).join( '' );
	const selection = promptUser( `${ message }:\n${ themesList }`, [], null );
	if ( selection ) {
		const number = parseInt( selection );
		if ( number ) {
			return themes[ number - 1 ];
		}
	}
	return null;
}