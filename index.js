#!/usr/bin/env node

require( './env' );
require( './sbm' )().catch( e => console.error( e ) );