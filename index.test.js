/* eslint-disable no-undefined */
const realFs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MemoryFileSystem = require('memory-fs');
const chai = require('chai');
const mocha = require('mocha');

const expect = chai.expect;
const describe = mocha.describe;
const it = mocha.it;

const Plugin = require('./');
const baseConfig = require('./test/webpack.config');
const manifestOutput = path.join(__dirname, 'test', 'build');
const filePath = path.join(manifestOutput, 'manifest.json');

const runWebpack = function(callback, plugin, webpackConfig) {
  const config = Object.assign(baseConfig, webpackConfig || {});

  config.plugins.push(plugin);

  const compiler = webpack(config);
  this.fs = compiler.outputFileSystem = new MemoryFileSystem();

  compiler.run(callback.bind(this));
};

describe('Webpack rails manifest plugin', () => {
  it('can be required', () => {
    expect(Plugin).not.to.eq(undefined);
    expect(new Plugin().apply).not.to.eq(undefined);
  });

  it('it emits a file called manifest.json', (done) => {
    runWebpack(function(err) {
      const fs = this.fs;
      const manifestFile = fs.readFileSync(filePath, 'utf-8');

      expect(err).to.eq(null);
      expect(manifestFile).not.to.eq(undefined);
      done();
    }, new Plugin());
  });

  it('it can specify the file name of emitted file', (done) => {
    runWebpack(function(err) {
      const fs = this.fs;
      const alternateFilePath = path.join(manifestOutput, 'allFiles.json');
      const manifestFile = fs.readFileSync(alternateFilePath, 'utf-8');

      expect(err).to.eq(null);
      expect(manifestFile).not.to.eq(undefined);
      done();
    }, new Plugin({
      fileName: 'allFiles.json'
    }));
  });

  it('it should write both to memory and filesystem', (done) => {
    runWebpack(function(err) {
      const fs = this.fs;
      const manifestFile = fs.readFileSync(filePath, 'utf-8');
      const manifestFileReal = realFs.readFileSync(filePath, 'utf-8');

      expect(manifestFile).to.eq(manifestFileReal);
      expect(err).to.eq(null);
      expect(manifestFile).not.to.eq(undefined);
      done();
    }, new Plugin({
      writeToFileEmit: true
    }));
  });

  it('it should be able to specify extraneous files', (done) => {
    runWebpack(function(err) {
      const fs = this.fs;
      const manifestFile = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(manifestFile);

      expect(parsed['output.txt']).to.eq('file.txt');
      expect(err).to.eq(null);
      done();
    }, new Plugin({
      extraneous: {
        'output.txt': 'file.txt'
      }
    }));
  });

  it('it should key files by their require path', (done) => {
    runWebpack(function(err) {
      const fs = this.fs;
      const key = './my-files/file.txt';
      const manifestFile = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(manifestFile);

      expect(parsed[key]).not.to.eq(undefined);
      expect(err).to.eq(null);
      done();
    }, new Plugin(), {
      module: {
        loaders: [{
          test: /\.(txt|png)$/,
          loader: 'file'
        }]
      }
    });
  });
});
