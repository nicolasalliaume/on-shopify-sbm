const fs = require( 'fs' );
const dotenv = require( 'dotenv' );

module.exports = function( filePath ) {
	const content = fs.readFileSync( filePath, 'utf8' );
	return dotenv.parse( content );
}