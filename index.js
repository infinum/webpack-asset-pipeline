'use strict';

const path = require('path');
const fse = require('fs-extra');

module.exports = function WebpackAssetPipeline(options) {

   /**
   * Gets a file type from path.
   *
   * @param {string} filePath - A path to file.
   * @return {string} extension of a file.
   */
  const __getFileType = function(filePath) {
    return path.extname(filePath).substring(1);
  };

   /**
   * Writes a JSON to Webpack output path. If the output directory doesn't
   * exists it will create it.
   *
   * @param {JSON} manifest - The manifest containing files
   * @param {object} compilation - Object containing Webpack context
   * @param {object} props - Props passed to the plugin
   * @return {undefined}
   */
  const __writeOutSync = function(manifest, compilation, props) {
    const outputFolder = compilation.options.output.path;
    const outputFile = path.join(outputFolder, props.fileName);

    fse.outputFileSync(outputFile, manifest);
  };

   /**
   * Tries to find the user reuqired file in cace. If it does it returns the
   * file path user used in the `require` statement. Otherwise it returns null.
   *
   * @param {object} compilation - Object containing Webpack context
   * @param {string} assetName - Emitted file name
   * @return {string} path that user used in require/import
   */
  const __findOriginalAsset = function(compilation, assetName) {
    if (!compilation || !compilation.cache || typeof compilation.cache !== 'object') {
      return null;
    }

    const cacheKeys = Object.keys(compilation.cache);

    for (let keyIndex = 0; keyIndex < cacheKeys.length; keyIndex++) {
      const cache = compilation.cache[cacheKeys[keyIndex]];
      if (cache.assets && assetName in cache.assets) {
        return cache.rawRequest;
      }
    }

    return null;
  };

   /**
   * Webpack will call this method when installing the plugin. This registers
   * on all needed "events" in order to intercept any aditions to chunks and/or
   * assets.
   *
   * @param {object} compiler - Webpack comiler instance
   * @return {undefined}
   */
  const __apply = (compiler) => {
    const outputName = this.__props.fileName;
    const mapAssetPath = this.__props.mapAssetPath;
    const initialExtraneous = this.__props.extraneous || {};
    const moduleAssets = {};
    const manifest = {};

     /**
     * This gets run when Webpack is starting a new compliation and when an
     * asset is added. The asset then gets added as an item in moduleAssets.
     * The key is a file name (or the source name) and the value is the "compiled"
     * path.
     */
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('module-asset', (module, file) => {
        moduleAssets[file] = path.join(
            path.dirname(file),
            path.basename(module.userRequest)
        );
      });
    });

     /**
     * This gets run when Webpack is going to emit files. When this happens we
     * prepare the manifest file. Calling the callback tells Webpack that we
     * are done.
     */
    compiler.plugin('emit', (compilation, callback) => {
      const extraneous = initialExtraneous;
      const stats = compilation.getStats().toJson();

       /**
       * This applies all the files in chunks to any extraneous files specified.
       * If the chunk is named we are exporting this file as one file only. Eg.
       * application.min.js.
       */
      Object.assign(extraneous, compilation.chunks.reduce((compAcc, chunk) => (
        chunk.files.reduce((acc, file) => {
          const chunkName = chunk.name
            ? `${chunk.name}.${__getFileType(file)}`
            : file;

          let fileName = chunkName;
          if (typeof mapAssetPath === 'function') {
            fileName = mapAssetPath(fileName, fileName, true);
          }

          acc[fileName] = file;
          return acc;
        }, compAcc)
      ), {}));

       /**
       * If any files were added during compliation we apply them now to the
       * already populated manifest. We will only do this if we can find that
       * module.
       */
      Object.assign(extraneous, stats.assets.reduce((acc, asset) => {
        const originalAsset = __findOriginalAsset(compilation, asset.name);
        let assetName = originalAsset || moduleAssets[asset.name];

        if (assetName) {
          if (typeof mapAssetPath === 'function') {
            assetName = mapAssetPath(assetName, moduleAssets[asset.name], false);
          }

          acc[assetName] = asset.name;
        }

        return acc;
      }, {}));

       /**
       * Sort the files in the manifest before writing out. Also apply them to
       * the manifest object.
       */
      Object.keys(extraneous).sort().forEach((key) => {
        manifest[key] = extraneous[key];
      });

       /**
       * Prepare the manifest for writing out to file and/or memory.
       * The first argument is our manifest object, second one is replacer that
       * we are not using, and the third one is number of spaces used.
       */
      const json = JSON.stringify(manifest, null, 2);

       /**
       * Add our manifest file as an asset to Webpack. This emitts a newly
       * created file.
       */
      compilation.assets[outputName] = {
        source() {
          return json;
        },
        size() {
          return json.length;
        }
      };

      if (this.__props.writeToFileEmit) {
        __writeOutSync(json, compilation, this.__props);
      }

      callback();
    });
  };

  this.__props = Object.assign({
    fileName: 'manifest.json', // Manifest file name to be written out
    writeToFileEmit: false, // Should we write to fs even if run with memory-fs
    extraneous: null, // Any assets specified as "extra"
    mapAssetPath: (requirePath) => requirePath // Map the asset paths to the keys in manifest
  }, options || {});

  return {
    apply: __apply
  };
};
