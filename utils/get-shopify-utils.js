const ShopifyUtils = require( 'on-shopify-utils' );

module.exports = new ShopifyUtils({
	domain: process.env.DOMAIN,
	apiKey: process.env.KEY,
	password: process.env.PASSWORD,
})