webpack-rails-manifest-plugin
==============================

A missing link to Webpack and Ruby on Rails integration.

[![Build Status](https://semaphoreci.com/api/v1/infinum/webpack-rails-manifest-plugin/branches/master/shields_badge.svg)](https://semaphoreci.com/infinum/webpack-rails-manifest-plugin) [![npm version](https://badge.fury.io/js/webpack-rails-manifest-plugin.svg)](https://badge.fury.io/js/webpack-rails-manifest-plugin)

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

The function will receive three arguments:
* `requirePath` (e.g. `images/photos/sunset.jpg`) - the path that was originally required in JS/CSS/HTML
* `assetName` (e.g. `sunset.jpg`) - the file name that was originally required in JS/CSS/HTML
* `isChunk` (eg. `true`) - specifies if the file is in the named chunk. Output JS and CSS files usually are.

The function should return a string that will be used as a key in the manifest. By default, this will be the `requirePath` value.

## Rails

To use this file with Rails you have two choices:

#### 1. Adding a new `webpack_asset_url` helper

You'll need a helper to replace asset pipeline. Here is an example how you an do this:

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

**Take note that you can't use Rails `image_tag`, `stylesheet_link_tag`, `javascript_include_tag` helper.**

#### 2. Monkey patching rails assets helpers

Be sure to remove rails sprockets entirely by editing your `applicaton.rb` file

```Ruby
# Comment this out
# require 'rails/all'

# Include every module separately
require 'rails'
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
# require "sprockets/railtie"
require "rails/test_unit/railtie"
```

And after that copy the code below to your initializers folder `app/config/initializers/webpack-rails-manifest.rb`

```Ruby
module ActionView
  module Helpers
    module AssetTagHelper
      def image_tag(source, options={})
        options = options.symbolize_keys
        check_for_image_tag_errors(options)

        src = options[:src] = "/assets/#{webpack_manifest.fetch(source)}"

        unless src =~ /^(?:cid|data):/ || src.blank?
          options[:alt] = options.fetch(:alt){ image_alt(src) }
        end

        options[:width], options[:height] = extract_dimensions(options.delete(:size)) if options[:size]
        tag("img", options)
      end

      def javascript_include_tag(*sources)
        options = sources.extract_options!.stringify_keys
        path_options = options.extract!('protocol', 'extname', 'host').symbolize_keys
        sources.uniq.map { |source|
          tag_options = {
            "src" => "/assets/#{webpack_manifest.fetch(source + '.js')}"
          }.merge!(options)
          content_tag("script".freeze, "", tag_options)
        }.join("\n").html_safe
      end

      def stylesheet_link_tag(*sources)
        options = sources.extract_options!.stringify_keys
        path_options = options.extract!('protocol', 'host').symbolize_keys

        sources.uniq.map { |source|
          tag_options = {
            "rel" => "stylesheet",
            "media" => "screen",
            "href" => "/assets/#{webpack_manifest.fetch(source + '.css')}"
          }.merge!(options)
          tag(:link, tag_options)
        }.join("\n").html_safe
      end

      private

        def webpack_manifest
          @manifest ||= JSON.parse(File.read('manifest.json'))
        rescue
          fail 'Please run webpack'
        end

        def extract_dimensions(size)
          size = size.to_s
          if size =~ %r{\A\d+x\d+\z}
            size.split('x')
          elsif size =~ %r{\A\d+\z}
            [size, size]
          end
        end

        def check_for_image_tag_errors(options)
          if options[:size] && (options[:height] || options[:width])
            raise ArgumentError, "Cannot pass a :size option with a :height or :width option"
          end
        end
    end
  end
end

```

Now, you can keep using rails helpers to get the assets

```Ruby
= image_tag('logo.svg')

= stylesheet_link_tag 'application', media: 'all'
= javascript_include_tag 'application'
```

## License

The MIT License

![](https://assets.infinum.co/assets/brand-logo-9e079bfa1875e17c8c1f71d1fee49cf0.svg) © 2016 Infinum Inc.
