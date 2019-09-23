const promptUser = require( 'command-prompt-user' );
const getBranch = require( '../utils/get-git-branch' );
const getMatchingTheme = require( '../utils/get-theme-by-name' );
const createTheme = require( '../utils/create-theme' );
const syncTheme = require( '../utils/sync-theme' );
const selectTheme = require( '../utils/select-theme' );

module.exports = async function( command ) {
	const source = command[ '__' ][ 1 ];
	let target = command[ '__' ][ 2 ] || command.as;

	const invalidSource = () => { throw new Error( `You must specify a valid theme to publish.` ); }
	const invalidTarget = () => { throw new Error( `You must specify a valid target theme.` ); }

	let sourceTheme;

	if ( source ) {
		sourceTheme = await getMatchingTheme( source );
		if ( ! sourceTheme ) {
			return invalidSource();
		}
	}
	else {
		const currentBranch = await getBranch();
		
		sourceTheme = await getMatchingTheme( currentBranch );
		if ( ! sourceTheme ) {
			return invalidSource();
		}

		const sourceIsBranch = promptUser( 
			`🚩 Do you want to publish theme ${ sourceTheme.name.bold.green }?` 
		)
		
		if ( sourceIsBranch.toLowerCase() === 'n' ) {
			!command.silent && console.log( 'Cancelled.' );
			return;
		}
	}

	let targetTheme;

	if ( target ) {
		targetTheme = await getMatchingTheme( target );
		
		if ( ! targetTheme ) {
			const createTargetTheme = promptUser( 
				`🚩 Do you want to create a theme called ${ target.bold.yellow }?`,
				undefined,
				'n'
			);

			if ( createTargetTheme.toLowerCase() === 'n' ) {
				return invalidTarget();
			}

			targetTheme = await createTheme( target );
		}
	}
	else {
		targetTheme = await selectTheme( 'Select a target theme to publish to' );
		
		if ( ! targetTheme ) {
			return invalidTarget();
		}

		if ( targetTheme.name.includes( 'master' ) ) {
			const masterCheck = promptUser( 
				`⚠️ You're about to change the master theme.\n`
				+ `Type in ${ "master".bold.green } and hit "Intro" to continue`,
				[],
				'' 
			);

			if ( masterCheck.toLowerCase() !== 'master' ) {
				!command.silent && console.log( 'Cancelled.' );
				return;
			}
		}
	}

	await syncTheme( sourceTheme.id, targetTheme.id, undefined, command.silent );

	const copySettings = promptUser( 
		`🚩 Do you want to copy settings data from another theme?`,
		undefined,
		'n'
	);

	if ( copySettings.toLowerCase() === 'y' ) {
		const settingsSourceTheme = await selectTheme();
		if ( settingsSourceTheme ) {
			!command.silent && console.log( 
				`Copying settings_data.json from theme ${ settingsSourceTheme.name.bold.green }`
			);
			await syncTheme( 
				settingsSourceTheme.id, 
				targetTheme.id, 
				[ 'config/settings_data.json' ], 
				command.silent 
			);
		}
	}

	!command.silent && console.log( '✅ Done.'.green ); 
}