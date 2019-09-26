module.exports = function( 
	sourceThemeId, 
	targetThemeId, 
	assets = [], 
	silent = false, 
	force = false 
) {
	const ShopifyUtils = require( './get-shopify-utils' );
	return ShopifyUtils.theme.sync( sourceThemeId, targetThemeId, assets, silent, force );
}