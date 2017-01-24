Rails configuration
===================

The only thing Ruby on Rails needs to do is to replace the assets helpers. This can be done in one of two ways (depending on your preferences). In both cases, you should remove Rails sprockets because they will not be used, and you won’t be able to use their methods by mistake. The easiest way to do this is with the following command when you’re creating your app:

```bash
rails new app --skip-sprockets
```

#### 1. Adding a new `webpack_asset_url` helper

You'll need a helper to replace the asset pipeline. Here is an example of how you can do this:

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

This module can then be saved in an appropriately named file (e.g. `app/helpers/webpack_helper.rb`).

Now you can use it like this:

```HTML
<img src="#{webpack_asset_url('logo.svg')}" alt="logo" />
```

to require your assets. [Here](https://github.com/infinum/webpack-asset-pipeline/blob/master/example/webpack.config.js#L12) is an example of how to add a digest to a file.

**Please note that you can't use Rails `image_tag`, `stylesheet_link_tag`, `javascript_include_tag` helpers.**

#### 2. Monkey patching Rails assets helpers

The second solution means a little more work in the start, but your application code will stay the same. Although removing sprockets is optional in the first method, in this case you have to remove them.

Then save the following code in the initializers directory as `app/config/initializers/webpack-rails-manifest.rb`

```Ruby
# https://github.com/rails/rails/blob/v4.2.6/actionview/lib/action_view/helpers/asset_tag_helper.rb

module ActionView
  module Helpers
    module AssetTagHelper
      def image_tag(source, options={})
        options = options.symbolize_keys

        src = options[:src] = "/assets/#{webpack_manifest.fetch(source)}"

        unless src =~ /^(?:cid|data):/ || src.blank?
          options[:alt] = options.fetch(:alt){ image_alt(src) }
        end

        options[:width], options[:height] = extract_dimensions(options.delete(:size)) if options[:size]
        tag("img", options)
      end

      def javascript_include_tag(*sources)
        options = sources.extract_options!.stringify_keys
        path_options = options.extract!('protocol', 'extname').symbolize_keys
        sources.uniq.map { |source|
          tag_options = {
            "src" => "/assets/#{webpack_manifest.fetch(source + '.js')}"
          }.merge!(options)
          content_tag(:script, "", tag_options)
        }.join("\n").html_safe
      end

      def stylesheet_link_tag(*sources)
        options = sources.extract_options!.stringify_keys
        path_options = options.extract!('protocol').symbolize_keys

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
    end
  end
end
```

After you're done with monkey patching, you'll be able to use the assets in the same way you used the asset pipeline:

```Ruby
= image_tag('logo.svg')

= stylesheet_link_tag 'application', media: 'all'
= javascript_include_tag 'application'
```

NOTE: this is an example for rails 4.2.6, the code above may vary on different rails versions
