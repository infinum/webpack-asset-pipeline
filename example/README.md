Example Webpack setup
======================

Here is an example of a Webpack configuration. The given `webpack.config.js` configuratio nfile will output two bundles (`application.js` and `vendor.js`), as well as process an image.

## Starting

Clone the plugin and run `npm install` in the root folder, and in the `example/` folder. Then `npm start` to start Webpack. In the folder `build/` you should see four files:

1. `application.js`,
2. `vendor.js`,
3. `963eb32907744d9a0d6b98127162808f.svg` (fingerprinted file name will be different),
4. and `manifest.json` file.

## Basic configuration

The configuration consists of four parts:

### 1. `entry`

This is an array, or an object where you can list all the JavaScript files where you require every other asset (JS, SCSS, images, fonts...). Here we are listing two file, `application.js` and `vendor.js`, that are going to produce two outputs.

### 2. `output`

Webpack will store the resulting JS, SCSS, and other asset files in the given directory after processing them.

### 3. `plugins`

You define the `RailsManifestPlugin` with any other options. For all available options take a look at the [options documentation](../documentation/options.md).

### 4. `module`

The loaders used for loading and processing your files are defined here. In this example, only a `file-loader` is added for `.svg` files.

For a more complete picture of Webpack you should really take your time and read through the [official documentation](https://webpack.github.io/docs/).

## Output

You should get something like this:

```JavaScript
{
  "./logo.svg": "b69d5b43fc856f23ef7d8f0c8cc6b313.svg",
  "application.js": "application.js",
  "vendor.js": "vendor.js"
}
```

## Integration with Rails

For more information on how to completely replace the asset pipeline read the [Rails integration documentation](../documentation/rails.md).  
