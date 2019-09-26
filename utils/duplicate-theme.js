module.exports = function( sourceId, targetName ) {
	const ShopifyUtils = require( './get-shopify-utils' );
	return ShopifyUtils.theme.duplicate( sourceId, targetName );
}