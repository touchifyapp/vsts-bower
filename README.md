# Bower for Visual Studio Team Services [![Build Status](https://travis-ci.org/touchifyapp/vsts-bower.svg)](https://travis-ci.org/touchifyapp/vsts-bower)

[Bower](http://bower.io) build task for [Visual Studio Team Services](https://www.visualstudio.com/fr-fr/products/visual-studio-team-services-vs.aspx).

## Installation

Installation can be done using [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=touchify.vsts-bower).

## Usage

Add the task to your build configuration:

![Add Bower Task](https://raw.githubusercontent.com/touchifyapp/vsts-bower/master/screenshots/screen-add.png)

_(Optional)_. Select `command` to execute in bower. (Defaults to `install`).

![Set command](https://raw.githubusercontent.com/touchifyapp/vsts-bower/master/screenshots/screen-simple.png)

_(Optional)_. Set advanced settings.

![Set advanced](https://raw.githubusercontent.com/touchifyapp/vsts-bower/master/screenshots/screen-advanced.png)

## Options

* __Command__: Command to execute.  _Default:_ `install`.
* __Arguments__: Additional arguments passed to bower.  `--config.interactive=false` is not needed.
* __Bower JSON Path__: Relative path to `bower.json` file.  _Default:_ `bower.json`.
* __Bower CLI__: _Optional._  bower runtime to run.  When agent can't find this bower runtime nor global installed one, it will install bower locally before run (slower).  _Default:_ `node_modules/bower/bin/bower`.

## License

[MIT](https://raw.githubusercontent.com/touchifyapp/vsts-bower/master/LICENSE)