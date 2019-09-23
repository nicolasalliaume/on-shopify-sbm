const ShopifyUtils = require( './get-shopify-utils' );

module.exports = function() {
	return ShopifyUtils.theme.list();
}