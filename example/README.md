Example Webpack setup
======================

Here you'll find an example Webpack configuration. The `webpack.config.js` here will output two bundles here: `application.js` and `vendor.js`, and will process an image.

## Starting

Clone the plugin and run `npm install` in the root folder and in the `example/` folder. Then start `npm run` to start Webpack. In the folder `build/` you should see four files:

1. `application.js`,
2. `vendor.js`,
3. `963eb32907744d9a0d6b98127162808f.svg` (fingerprint will be different),
4. and `manifest.json` file.

## Basic configuration

The configuration is consited out of 4 main parts:

### 1. `entry`

Here you define where are the JavaScript files where you will require all other JS code, SCSS (not in this example), and other assets. They are named here `application` and `vendor`. That are the names that they will take when outputed.

### 2. `output`

This is where you define the output path for all the Webpack generated files. Here your JS, SCSS, and other asset files will end up after the Webpack finishes.

### 3. `plugins`

You define the `RailsManifestPlugin` with any other needed options. For all available options take a look at the [options documentation](../documentation/options.md).

### 4. `module`

Here are all the loaders used for your files. In this example only a `file-loader` is added for `.svg` files.

For a more complete picture of Webpack you should really take your time and read thru the [documentation](https://webpack.github.io/docs/).

## Output

And you should get something like this out:

```JavaScript
{
  "./logo.svg": "b69d5b43fc856f23ef7d8f0c8cc6b313.svg",
  "application.js": "application.js",
  "vendor.js": "vendor.js"
}
```

## Integration with Rails

For more info on how to completely replace asset pipeline read the [Rails integration documentation](../documentation/rails.md).  
