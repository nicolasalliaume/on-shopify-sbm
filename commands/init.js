const Command = require( './command' );
const fs = require('fs');
const createGitBranch = require( '../utils/create-git-branch' );
const stripCommandAuth = require( '../utils/strip-command-auth' );
const createSBMEnv = require( '../utils/create-sbm-env' );
const createSlateEnv = require( '../utils/create-slate-env' );
const readEnvFile = require( '../utils/read-env-file' );
const { join } = require( 'path' );


class InitCommand extends Command {

	async execute() {
		this.createAuthenticationFile();
		this.loadEnvironment();
		this.masterTheme = await this.createMasterThemeIfNeeded();
		this.devTheme = await this.createDevThemeIfNeeded();
		this.createSlateEnvFile( this.devTheme );
		await this.createAndCheckoutDevBranch();
		this.reporter.info( `✅  Shopify SBM initialized.`.green );
	}


	createAuthenticationFile() {
		this.reporter.info( `Creating SBM env file for store...` );
		const { domain, apiKey, password } = this.getAuth();
		createSBMEnv( domain, apiKey, password );
		this.reporter.info( `SBM env file created.` );
	}


	loadEnvironment() {
		const env = readEnvFile( '.env.sbm' );
		for ( var k in env ) {
			process.env[ k ] = env[ k ];
		}
	}


	createMasterThemeIfNeeded() {
		return this.createThemeIfNotExists( 'master' );
	}


	createDevThemeIfNeeded() {
		return this.createThemeIfNotExists( 'dev' );
	}


	async createThemeIfNotExists( themeName ) {
		this.reporter.info( `Creating theme ${ themeName.green }...` );
		const getMatchingTheme = require( '../utils/get-theme-by-name' );
		let theme = await getMatchingTheme( themeName );
		if ( theme ) {
			this.reporter.info( `Skipped. Theme ${ themeName.green } already exists.` );
			return theme;
		}
		const createTheme = require( '../utils/create-theme' );
		theme = await createTheme( themeName );
		this.reporter.info( `Theme ${ themeName.green } created.` );
		return theme;
	}

	
	createSlateEnvFile( devTheme ) {
		this.reporter.info( `Updating Slate env variables...` );
		const { domain, password } = this.getAuth();
		createSlateEnv( domain, password, devTheme.id );
		this.reporter.info( `Slate env variables updated.` );
	}


	async createAndCheckoutDevBranch() {
		this.reporter.info( `Creating branch ${ 'dev'.green }...` );
		try {
			await createGitBranch( 'dev' );
			this.reporter.info( `Branch ${ 'dev'.green } created.` );
		}
		catch ( e ) {
			console.log( 
				`Error while creating dev branch: ${ e.message.red }. `
				+ `Dismiss this error if branch already exists.` 
			);
		}
	}


	getAuth() {
		return stripCommandAuth( this.command );
	}

}

module.exports = InitCommand;

