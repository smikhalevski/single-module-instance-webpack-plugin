# Single Module Instance Webpack Plugin

Even after deduplication module can be initialized more than once which can cause unexpected
consequences. Adding this plugin along with `DedupePlugin` would case `require` to serve only
only instance of each requested module.

Add `SingleModuleInstancePlugin` instance to `webpack.config.js`.

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

MIT (http://www.opensource.org/licenses/mit-license.php)
