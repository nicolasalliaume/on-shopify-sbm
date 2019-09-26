module.exports = function() {
	const ShopifyUtils = require( './get-shopify-utils' );
	return ShopifyUtils.theme.list();
}