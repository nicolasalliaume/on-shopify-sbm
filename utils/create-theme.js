module.exports = function( name ) {
	const ShopifyUtils = require( './get-shopify-utils' );
	return ShopifyUtils.theme.create( name );
}