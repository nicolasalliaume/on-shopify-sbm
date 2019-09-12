const fs = require( 'fs' );

module.exports = function( path, replaceString, withString ) {
	const contents = fs.readFileSync( path, 'utf8' );
	const newContents = contents.replace( replaceString, withString );
	return fs.writeFileSync( path, newContents, 'utf8' );
}