const ShopifyUtils = require( './get-shopify-utils' );

module.exports = function( 
	sourceId, 
	targetId, 
	assets = [], 
	silent = false, 
	force = false 
) {
	return ShopifyUtils.theme.sync( sourceId, targetId, assets, silent, force );
}