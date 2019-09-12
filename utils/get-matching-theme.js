const ShopifyUtils = require( './get-shopify-utils' );

module.exports = async function( name ) {
	const themes = await ShopifyUtils.theme.list();
	return themes.find( 
		theme => new RegExp( `(.*\s?-\s?)?${ name }$`, 'i' ).test( theme.name )
	);
}