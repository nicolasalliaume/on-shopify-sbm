#!/usr/bin/env node

require( './env' );
require( './sbm' )().catch( e => {
	console.error( e );
	process.exit( 1 );
} );