Plugin options
===============

The plugin allows you to specify several options. Here are the default values:

```JavaScript
new RailsManifestPlugin({
  fileName: 'manifest.json',
  writeToFileEmit: false,
  extraneous: null,
  mapAssetPath: (requirePath) => requirePath
});
```

### fileName

This is the output file that will be created after each change. The default value is `manifest.json`.

### writeToFileEmit

When using this plugin with [webpack-dev-plugin](https://github.com/webpack/webpack-dev-server) the manifest file will not be written to a file, but to an in-memory filesystem used by webpack-dev-plugin. Setting this to `true` will always create a file on the filesystem.

### extraneous

If for any reason you wish to supply the files that will not go through the Webpack comilation you can do so here. It's important to note that they **will not** be copied over to the output folder.

```JavaScript
{
  // ...
  extraneous: ['./file.jpg'],
  // ...
}
```

### mapAssetPath

The function will receive three arguments:
* `requirePath` (e.g. `images/photos/sunset.jpg`) - the path that was originally required in JS/CSS/HTML
* `assetName` (e.g. `sunset.jpg`) - the file name that was required in JS/CSS/HTML
* `isChunk` (eg. `true`) - specifies if the file is in the named chunk. Output JS and CSS files usually are.

The function should return a string that will be used as a key in the manifest. By default, this will be the `requirePath` value.
