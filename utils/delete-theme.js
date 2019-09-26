module.exports = function( name, path ) {
	const ShopifyUtils = require( './get-shopify-utils' );
	return ShopifyUtils.theme.remove( name );
}