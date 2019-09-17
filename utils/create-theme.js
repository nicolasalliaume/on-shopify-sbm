const ShopifyUtils = require( './get-shopify-utils' );

module.exports = function( name ) {
	return ShopifyUtils.theme.create( name );
}