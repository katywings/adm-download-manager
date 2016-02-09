# About
Are you annoyed, that you need to manually download updates of Live Packs? Then ADM is maybe something for you. It will store version info in a local file and download new packs.

However note that this software is not created by Ableton AG and has nothing to do with Ableton AG. Ableton AG is not responsible for this software. Also read the LICENSE.

# Requirements
- Nodejs
- NPM

# Optional configs
## Username and Password
If you don't want to type in your username and password everytime you are using this tool, create a file with the filename `local.json` in the `config` folder.

Add the following content:

	{
		"username": "yourUsernameOrEmail"
		,"password": "yourPassword"
	}

## More configs
Have a look in the `default.json` file of the `config` folder.

# First time using ADM?
When you already have downloaded some packs in the past without ADM, and you now start using ADM launch ADM with the command: `./adm.sh -i`

# General launch
When you use the command `./adm.sh`, ADM will try to login to ableton.com, download a list of the current packs, comparing them with the list in `packs.json` and download all new packs.

# Arguments
- `-i` = More info about this argument in the **First time using ADM?** - Chapter
- `-u yourUsernameOrEmail` = Optional parameter to enter your username
- `-p yourPassword` = Optional parameter to enter your password

# Roadmap
- Add comments on major code parts
- Improve ADM initialization process (make it easier for new user)
- Add download loadbar

# Changelog
## 1.1
- Increased default timeout configuration from 2000 to 10000, to reduce the download cancel-rate.
- Fixed bug: Order of packs in packs.json was not correctly ascending sorted because the pack id has upper and lower case characters.
- Fixed bug: Some downloaded files were corrupted, switched to an other download method `Request. Couldn't reproduce the problem with this new method.

## 1.0.1
Added the ability to download the free Ableton Live Packs.

## 1.0
Basic functionality programmed. Does only download buyed Ableton Live Packs.

# Backups
You can find backups of old `packs.json` files in the `backups` folder. But be warned: The backups will not include manual changes you did to the packs.json file.

# About packs.json
Don't change anything in the packs.json file except when you are asked to by ADM! The `packs.json` file will be overwritten by ADM. So don't add your journal or notes in that file, they will be overwritten and lost forever.

# Trademark Information
Ableton and Ableton Live Pack are Trademarks of Ableton AG.
