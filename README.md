# Single Module Instance Webpack Plugin

[![npm version](https://badge.fury.io/js/single-module-instance-webpack-plugin.svg)](https://www.npmjs.com/package/single-module-instance-webpack-plugin)

At runtime webpacked module [can be initialized more than once][webpack-1353] which is expected
behavior for Node. Nevertheless this behavior hurts a lot if you are used to RequireJS and even
may introduce unexpected singleton collisions.

`SingleModuleInstanceWebpackPlugin` plugin along with [`DedupePlugin`][dedupe-plugin] would force
`require` to serve only one instance of each requested module.

Update `webpack.config.js` with following snippet:

``` js
var SingleModuleInstancePlugin = require('single-module-instance-webpack-plugin');

module.exports = {
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new SingleModuleInstancePlugin()
  ]
}
```

## TODO

- Add tests

## License

The code is available under [MIT licence](LICENSE.txt).

[dedupe-plugin]: https://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
[webpack-1353]: https://github.com/webpack/webpack/pull/1353
