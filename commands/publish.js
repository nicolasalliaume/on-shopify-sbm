const Command = require( './command' );
const promptUser = require( 'command-prompt-user' );
const getBranch = require( '../utils/get-git-branch' );
const getMatchingTheme = require( '../utils/get-theme-by-name' );
const createTheme = require( '../utils/create-theme' );
const syncTheme = require( '../utils/sync-theme' );
const selectTheme = require( '../utils/select-theme' );


class PublishCommand extends Command {

	async execute() {
		this.source = this.getArgument( this.ARGUMENTS.SOURCE );
		this.target = this.getArgument( 
			this.ARGUMENTS.TARGET,
			this.ARGUMENTS.TARGET_NAMED 
		);

		this.sourceTheme = await this.getSourceTheme( this.source );
		this.targetTheme = await this.getTargetTheme( this.target );
		await syncTheme( 
			this.sourceTheme.id, 
			this.targetTheme.id, 
			undefined, 
			this.command.silent 
		);
		await this.copySettings( this.targetTheme );
		this.reporter.info( '✅ Done.'.green );
	}


	async getSourceTheme( themeName ) {
		const errorMessage = `You must specify a valid theme to publish.`;
		if ( themeName ) {
			return this.getThemeOrThrow( themeName, errorMessage );
		}
		return this.getCurrentBranchThemeOrThrow( errorMessage );
	}


	async getCurrentBranchThemeOrThrow( errorMessage ) {
		const branchName = await getBranch();
		const theme = await this.getThemeOrThrow( branchName, errorMessage );
		this.continueOrThrow( `🚩 Do you want to publish theme ${ theme.name.bold.green }?` );
		return theme;
	}


	async getTargetTheme( themeName ) {
		const errorMessage = `You must specify a valid target theme.`;
		
		if ( themeName ) {
			const theme = await getMatchingTheme( themeName );
			if ( ! theme ) {
				return this.createThemeOrThrow( themeName, errorMessage );
			}
			return theme;
		}
		
		const theme = await this.selectThemeOrThrow( 'Select a target theme to publish to', errorMessage );
		this.verifyMasterTheme( theme );
		return theme;		
	}


	createThemeOrThrow( themeName, errorMessage ) {
		const approval = promptUser( 
			`🚩 Do you want to create a theme called ${ themeName.bold.yellow }?`,
			undefined,
			'n'
		);
		if ( approval.toLowerCase() === 'n' ) {
			throw new Error( errorMessage );
		}
		return createTheme( themeName );
	}


	verifyMasterTheme( theme ) {
		if ( theme.name.includes( 'master' ) ) {
			const masterCheck = promptUser( 
				`⚠️ You're about to change the master theme.\n`
				+ `Type in ${ "master".bold.green } and hit "Intro" to continue`,
				[],
				'' 
			);
			if ( masterCheck.toLowerCase() !== 'master' ) {
				throw new Error( `Cancelled.` );
			}
		}
	}


	async copySettings( targetTheme ) {
		const copySettings = promptUser( 
			`🚩 Do you want to copy settings data from another theme?`,
			undefined,
			'n'
		);
		if ( copySettings.toLowerCase() === 'y' ) {
			const settingsSourceTheme = await selectTheme( `Select source theme for settings asset` );
			if ( settingsSourceTheme ) {
				this.reporter.info( 
					`Copying settings_data.json from theme ${ settingsSourceTheme.name.bold.green }`
				);
				await syncTheme( 
					settingsSourceTheme.id, 
					targetTheme.id, 
					[ 'config/settings_data.json' ], 
					this.command.silent 
				);
			}
		}
	}

}


PublishCommand.prototype.ARGUMENTS = {
	SOURCE: 1,
	TARGET: 2,
	TARGET_NAMED: 'as'
}

module.exports = PublishCommand;
