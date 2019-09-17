const ShopifyUtils = require( './get-shopify-utils' );

module.exports = function( 
	sourceThemeId, 
	targetThemeId, 
	assets = [], 
	silent = false, 
	force = false 
) {
	return ShopifyUtils.theme.sync( sourceThemeId, targetThemeId, assets, silent, force );
}