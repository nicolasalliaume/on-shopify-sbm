module.exports = class Reporter {

	info( message ) {}

	warning( message ) {}

	error( error ) {
		throw error;
	}
}