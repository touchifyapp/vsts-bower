# vso-bower [![Build Status](https://travis-ci.org/touchifyapp/vso-bower.png)](https://travis-ci.org/touchifyapp/vso-bower)

[Bower](http://bower.io) build task for [Visual Studio Team Services](https://www.visualstudio.com/fr-fr/products/visual-studio-team-services-vs.aspx).

## Installation

Install can be done using [Visual Studio MarketPlace](http://marketplace.visualstudio.com).

## Usage

Add the task to your build configuration:

_ScreenShot_

_(Optional)_. Select `command` to execute in bower. (Defaults to `install`).

_ScreenShot_

## Options

* __Command__: Command to execute.  _Default:_ `install`.
* __Arguments__: Additional arguments passed to bower.  `--config.interactive=false` is not needed.
* __Bower JSON Path__: Command to execute.  _Default:_ `bower.json`.
* __Bower CLI__: _Optional._  bower runtime to run.  When agent can't find this bower runtime nor global installed one, it will install bower locally before run (slower).  _Default:_ `node_modules/bower/bin/bower`.