const createGitBranch = require( '../utils/create-git-branch' );
const createTheme = require( '../utils/create-theme' );
const getMatchingTheme = require( '../utils/get-theme-by-name' );
const syncTheme = require( '../utils/sync-theme' );
const Command = require( './command' );


class BranchCommand extends Command {

	async execute() {
		this.branchName = this.getBranchOrThrow();
		this.reporter.info( `Creating empty Shopify theme ${ this.branchName.bold.green }...` );
		this.devTheme = await this.getThemeOrThrow( 'dev' );
		this.newTheme = await this.getNewThemeOrThrow( this.branchName, this.command.y );
		await this.copyAssets( this.devTheme, this.newTheme );
		await this.createBranch( this.branchName );
		this.reporter.info( `Run ${ `yarn start`.gray } to upload the theme to Shopify and start working.`.blue );
		this.reporter.info( `✅ Done` );	
	}


	getBranchOrThrow() {
		return this.getArgumentOrThrow( 
			BranchCommand.ARGUMENTS.BRANCH, 
			`You must specify a branch name as first argument`.red
		)
	}


	async getNewThemeOrThrow( themeName, continueIfExists = false ) {
		let theme = await getMatchingTheme( themeName );
		if ( theme && !continueIfExists ) {
			this.continueOrThrow( `Theme ${ theme.name.blue.bold } already exists. Continue anyway?` );
			this.reporter.info( 'Continuing...' );
		}
		else {
			theme = await createTheme( themeName );
			this.reporter.info( `Theme ${ theme.name.bold } created.`.green );
		}
		return theme;
	}


	async copyAssets( sourceTheme, targetTheme ) {
		const assetsToCopy = [ 'config/settings_data.json' ];
		
		this.reporter.info( 
			`Copying assets from theme ${ sourceTheme.name.blue.bold } `
			+ `to theme ${ targetTheme.name.blue.bold }...`
			+ `\n\t* ` + assetsToCopy.join( '\n\t* ' ) 
		);

		return syncTheme( 
			sourceTheme.id, 
			targetTheme.id, 
			assetsToCopy, 
			this.command.silent, 
			this.command.y 
		);
	}


	async createBranch( branchName ) {
		this.reporter.info( `Creating git branch ${ branchName.bold.green }...` );
		await createGitBranch( branchName, 'dev' );
		this.reporter.info( `Created git branch ${ branchName.bold }`.green );
	}

}

BranchCommand.ARGUMENTS = {
	BRANCH: 1,
}


module.exports = BranchCommand;

