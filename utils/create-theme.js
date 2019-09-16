const ShopifyUtils = require( './get-shopify-utils' );

module.exports = function( name, path ) {
	return ShopifyUtils.theme.create( name, path );
}