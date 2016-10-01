webpack-rails-manifest-plugin
==============================

A missing link to Webpack and Ruby on Rails integration.

[![Build Status](https://semaphoreci.com/api/v1/infinum/webpack-rails-manifest-plugin/branches/master/badge.svg)](https://semaphoreci.com/infinum/webpack-rails-manifest-plugin) [![npm version](https://badge.fury.io/js/webpack-rails-manifest-plugin.svg)](https://badge.fury.io/js/webpack-rails-manifest-plugin)

This plugin can be used to flush a list of your assets to a `manifest.json` file and replace asset pipeline. Using that file you can require your assets in Rails (see [Rails helper](#rails)).

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

You'll find the `manifest.json` file in your output directory.

## Options

You can specify a few options to the plugin:

```JavaScript
new RailsManifestPlugin({
  fileName: 'manifest.json', // Manifest file name to be written out
  writeToFileEmit: false, // Should we write to fs even if run with memory-fs
  extraneous: null, // Any assets specified as "extra"
  mapAssetPath: (requirePath) => requirePath // Map the asset paths to the keys in manifest
});
```

### mapAssetPath

The function will receive two arguments:
* `requirePath` (e.g. `images/photos/sunset.jpg`) - the path that was originally required in JS/CSS/HTML
* `outputPath` (e.g. `assets/sunset-44b3dae18da1232cf0c3c9aacd467ae6.jpg`) - the path where the file will be saved

The function should return a string that will be used as a key in the manifest. By default, this will be the `requirePath` value.

## Rails

To use this file with Rails you'll need a helper to replace asset pipeline. Here is an example how you an do this:

```Ruby
module WebpackHelper
  def webpack_asset_url(asset)
    "/assets/#{manifest.fetch(asset)}"
  end

  def manifest
    @manifest ||= JSON.parse(File.read('manifest.json'))
  rescue
    fail 'Please run webpack'
  end
end
```

This file would then be saved in `app/helpers/webpack_helper.rb` for example.

Now you can use it like this:

```HTML
<img src="#{webpack_asset_url('logo.svg')}" alt="logo" />
```

to require your assets. [Here](https://github.com/infinum/webpack-rails-manifest-plugin/blob/master/example/webpack.config.js#L12) is an example on how to add a digest to a file.

**Take note that you can't use Rails `image_tag` helper.**

## License

The MIT License

![](https://assets.infinum.co/assets/brand-logo-9e079bfa1875e17c8c1f71d1fee49cf0.svg) © 2016 Infinum Inc.
