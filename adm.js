#!/usr/bin/env node

var _ = require( 'lodash' );
var path = require('path');
var pathExists = require('path-exists');
var fs = require( 'fs' );
var moment = require('moment');
var cli = require( 'cli' ).enable( 'help', 'status', 'version', 'glob' );
var config = require('config');
const Browser = require('zombie');
const browser = new Browser();
var Download = require('download');
var downloadStatus = require('download-status');

var ableton = {
	login: {
		url: "https://www.ableton.com/login"
		, username: '#id_username'
		, password: '#id_password'
		, submit: '.test-login-form .form__submit input[type="submit"]'
	}
	, account: {
		url: "/account/"
		, downloadItems: ".downloads .downloads__item"
		, downloadItemName: ".downloads__item__description__title"
		, downloadItemButton: "a.js-download-button"
		, downloadFileNameRegex: /(.*?)_(.*?v.*?)\.alp/
	}
};

cli.parse( {
	username: [ 'u', 'The username of your Ableton account', 'string', '' ]
	password: [ 'p', 'The password of your Ableton account', 'string', '' ]
} );

cli.main( function( args, options ) {
	var self = this;

	var userName = config.get( 'username' );
	var password = config.get( 'password' );

	if ( options.password.trim() != '' ) {
		password = options.password.trim();
	}
	if ( options.username.trim() != '' ) {
		password = options.username.trim();
	}

    browser.visit( ableton.login.url, function() {
    	browser.fill( ableton.login.username, userName );
    	browser.fill( ableton.login.password, password );
    	browser.pressButton( ableton.login.submit, function() {
	    	if ( browser.location.href.indexOf( ableton.account.url ) == -1 ) {
	    		self.error( 'Login was not correct' );
	    		process.exit( 1 );
	    	} else {
	    		var localPacks = readPacksFile();
	    		var downloads = browser.querySelectorAll( ableton.account.downloadItems );
	    		var allPacks = {};
	    		var oldPacks = {};
	    		var oldPacksNames = [];
	    		_.forEach( downloads, function( elem ) {
	    			var elemUrl = elem.querySelector( ableton.account.downloadItemButton );
	    			if( elemUrl != null && elemUrl.getAttribute( 'href' ) != null && elemUrl.getAttribute( 'href' ) != '' ) {
	    				var url = elemUrl.getAttribute( 'href' );
	    				var fileNameRegex = ableton.account.downloadFileNameRegex.exec( path.basename( url ) );
	    				var version = '';
	    				var key = _.uniqueId();
	    				if ( fileNameRegex != null ) {
	    					key = fileNameRegex[ 1 ];
	    					version = fileNameRegex[ 2 ];
	    				}
		    			allPacks[ key ] = {
		    				name: browser.text( ableton.account.downloadItemName, elem )
		    				, url: url
		    				, version: version
		    			};
	    			}
	    		} );
	    		_.forEach( allPacks, function( pack, packKey ) {
	    			if ( localPacks[ packKey ] == null || localPacks[ packKey ].version != pack.version ) {
	    				oldPacks[ packKey ] = pack;
	    				oldPacksNames.push( pack.name );
	    			}
	    		} );

	    		if ( oldPacks.length != 0 ) {
	    			var download = new Download();
	    			download.dest( config.get( 'downloadPath' ) );
	    			download.use( downloadStatus() );
	    			_.forEach( oldPacks, function( pack ) {
	    				download.get( pack.url );
	    			} );
	    			download.run( function( err, files ) {
	    				if ( err ) {
	    					self.error( err );
	    					self.error( files );
	    					process.exit( 1 );
	    				} else {
	    					self.ok( 'Downloaded new versions' );
	    					fs.writeFileSync( JSON.stringify( allPacks ) );
	    					process.exit( 0 );
	    				}
	    			} );
	    		} else {
	    			self.ok( 'Everything up to date');
	    			process.exit( 0 );
	    		}
	    		//console.log( oldPacks );
	    	}
    	});
    } );
} );


var packsFilePath = 'packs.json';
var packsBackupFilePath = 'backups/' + moment().format( config.get( 'backupFileTimestamp' ) ) + '_packs.json';

var readPacksFile = function() {
	var localPacks = {};
	if( pathExists.sync( packsFilePath )) {
		var packsFileContent = fs.readFileSync( packsFilePath, 'utf-8' );
		localPacks = JSON.parse( packsFileContent );
	}
	return localPacks;
}

var savePacksFile = function( allPacks ) {
	fs.writeFileSync( packsFilePath, JSON.stringify( allPacks ) );
	fs.writeFileSync( packsBackupFilePath, JSON.stringify( allPacks ) );
};