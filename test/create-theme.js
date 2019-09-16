require( '../env' );
const assert = require('assert');
const createTheme = require( '../utils/create-theme' );
const deleteTheme = require( '../utils/delete-theme' );


describe( '#create-theme', function() {

	this.timeout( 10000 );

	let themeName = null;
	let theme = null;

	afterEach( async function() {

		if ( theme ) {
			return deleteTheme( theme.id );
		}
		return Promise.resolve();

	} );

	it( 'should create a new empty theme', async function() {
		themeName = `Test theme ${ new Date().toISOString() }`;
		theme = await createTheme( themeName );

		assert.ok( theme );
	} );

} )