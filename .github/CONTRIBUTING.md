# Contributing

From opening a bug report to creating a pull request: every contribution is
appreciated and welcome. If you're planning to implement a new feature or change
the api please create an issue first. This way we can ensure that your precious
work is not in vain.

Every attempt to help is valued! If you lack knowlage to code the wanted feature
don't hessitate to open the issue!

## Issues

Most of the time, if webpack is not working correctly for you it is a simple 
configuration issue. Check the `example/` folder for a simple setup.

## Setup

```bash
git clone https://github.com/infinum/webpack-rails-manifest-plugin
cd webpack-rails-manifest-plugin
npm install
```

To run the entire test suite use:

```bash
npm test
```

When developing use:

```bash
npm start
```

It will restart the test suite when it noticies changes.

Be sure to use [Node LTS](https://github.com/nodejs/LTS) version! 
All pull requests are tested against Node v4.5.0.

## Submitting Changes

After getting some feedback, push to your fork and submit a pull request. We
may suggest some changes or improvements or alternatives, but for small changes
your pull request should be accepted quickly.

Some things that will increase the chance that your pull request is accepted:

* Write tests
* Follow the existing Webpack coding style defined in the eslint jsbeutify and editor config rules.
* Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
* Write doucmentation for your feature

Failing to finish all the tasks will result in the PR being 
rejected and you will be asked to complete it. If you don't 
have enough knowlage to finish all the tasks please 
say so - we will be **happy** to help you out.
