webpack-rails-manifest-plugin
==============================

A missing link to Webpack and Rails integration.

[![Build Status](https://semaphoreci.com/api/v1/infinum/webpack-rails-manifest-plugin/branches/master/badge.svg)](https://semaphoreci.com/infinum/webpack-rails-manifest-plugin)

## Usage

This is a Webpack plugin that creates a manifest file for your assets. It can output files to Webpack (as emitting) or as a file on the filesystem.

In your `webpack.config.js` file specify the plugin:

```JavaScript
const RailsManifestPlugin = require('webpack-rails-manifest-plugin');

{
  plugins: [
    new RailsManifestPlugin()
  ]
}
```

You'll find the `manifest.json` file in your output directory.

## Options

You can specify a few options to the plugin:

```JavaScript
new RailsManifestPlugin({
  fileName: 'manifest.json', // Manifest file name to be written out
  writeToFileEmit: false, // Should we write to fs even if run with memory-fs
  extraneous: null // Any assets specified as "extra"
});
```  

## License

The MIT License

![](https://assets.infinum.co/assets/brand-logo-9e079bfa1875e17c8c1f71d1fee49cf0.svg) © 2016 Infinum Inc.
