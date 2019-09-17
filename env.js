const dotenv = require( 'dotenv' );

const filesToTry = [ './.env.sbm', './.env.cli', './.env' ];

for ( var i = 0; i < filesToTry.length; i++ ) {
	const file = filesToTry[ i ];
	const env = dotenv.config( { path: file } );

	if ( !env.error && 
		env.parsed.DOMAIN && 
		env.parsed.KEY &&
		env.parsed.PASSWORD 
	) {
		break;
	}
}