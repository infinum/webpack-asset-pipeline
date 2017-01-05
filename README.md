webpack-asset-pipeline
==============================

A missing link for the asset pipeline alternative with Webpack.

[![Build Status](https://semaphoreci.com/api/v1/infinum/webpack-asset-pipeline/branches/master/shields_badge.svg)](https://semaphoreci.com/infinum/webpack-asset-pipeline) [![npm version](https://badge.fury.io/js/webpack-asset-pipeline.svg)](https://badge.fury.io/js/webpack-asset-pipeline)

This plugin can be used to flush a list of your assets to a `manifest.json` file and replace the asset pipeline.

## Usage

This is a Webpack plugin that creates a manifest file for your assets. It can output files to Webpack (as emitting) or as a file on the filesystem.

```
npm install --save-dev webpack-asset-pipeline
```

In your `webpack.config.js` file specify the plugin:

```JavaScript
const WebpackAssetPipeline = require('webpack-asset-pipeline');

{
  plugins: [
    new WebpackAssetPipeline()
  ]
}
```

You'll find the `manifest.json` file in your output directory. You can read ore about the options [here](documentation/options.md).

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

Once you set everything up, you should see this in your `manifest.json` file:

```JavaScript
{
  "images/file1.jpg": "963eb32907744d9a0d6b98127162808f.jpg",
  "images/file2.jpg": "162808f4d9a0963eb3290774127d6b98.jpg",
  "images/file3.jpg": "d6b98127162969a0808f3eb32907744d.jpg"
}
```

## Compatibility

This plugin is compatible with Webpack 1.x and 2.x.

## Integrations

### Ruby on Rails

Requiring assets in Rails will be a bit different and needs some configuration. Read our [Rails helper documentation](documentation/integrations/rails.md).

### Others

We're open for pull requests that add instructions about how to integrate this plugin with other frameworks.

## License

The MIT License

![](https://assets.infinum.co/assets/brand-logo-9e079bfa1875e17c8c1f71d1fee49cf0.svg) © 2016 Infinum Inc.
