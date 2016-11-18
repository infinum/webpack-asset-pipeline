webpack-rails-manifest-plugin
==============================

A missing link to Webpack and Ruby on Rails integration.

[![Build Status](https://semaphoreci.com/api/v1/infinum/webpack-rails-manifest-plugin/branches/master/shields_badge.svg)](https://semaphoreci.com/infinum/webpack-rails-manifest-plugin) [![npm version](https://badge.fury.io/js/webpack-rails-manifest-plugin.svg)](https://badge.fury.io/js/webpack-rails-manifest-plugin)

This plugin can be used to flush a list of your assets to a `manifest.json` file and replace asset pipeline. Using that file you can require your assets in Rails (see [Rails helper](documentation/rails.md)).

## Usage

This is a Webpack plugin that creates a manifest file for your assets. It can output files to Webpack (as emitting) or as a file on the filesystem.

```
npm install --save-dev webpack-rails-manifest-plugin
```

In your `webpack.config.js` file specify the plugin:

```JavaScript
const RailsManifestPlugin = require('webpack-rails-manifest-plugin');

{
  plugins: [
    new RailsManifestPlugin()
  ]
}
```

You'll find the `manifest.json` file in your output directory. More about options can be read [here](documentation/options.md).

## Requiring images

All images have to be required in the JavaScript in order for webpack to process them, except the ones you require in your scss file (because wepback is processing your scss file adready)

You can create a new file which will hold all the images, e.g. `files.js`

```JavaScript
require('images/file1.jpg');
require('images/file2.jpg');
require('images/file3.jpg');
```

And then in `application.js` (your entrypoint)

```JavaScript
require('files');
```

You can see an example configuration and its documentation [here](example/README.md).

## Output

Once you set everything up you should see this in your `manifest.json` file:

```JavaScript
{
  "images/file1.jpg": "963eb32907744d9a0d6b98127162808f.jpg",
  "images/file2.jpg": "162808f4d9a0963eb3290774127d6b98.jpg",
  "images/file3.jpg": "d6b98127162969a0808f3eb32907744d.jpg"
}
```

## License

The MIT License

![](https://assets.infinum.co/assets/brand-logo-9e079bfa1875e17c8c1f71d1fee49cf0.svg) © 2016 Infinum Inc.
