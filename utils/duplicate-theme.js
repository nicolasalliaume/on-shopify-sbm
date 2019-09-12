const ShopifyUtils = require( './get-shopify-utils' );

module.exports = function( sourceId, targetName ) {
	return ShopifyUtils.theme.duplicate( sourceId, targetName );
}