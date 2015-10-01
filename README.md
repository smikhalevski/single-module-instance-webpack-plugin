# Single Module Instance Webpack Plugin

At runtime webpacked module can be initialized more than once which is expected behavior on Node.
This hurts a lot if you are used to RequireJS and thus may cause unexpected singleton collisions.
Adding this plugin along with `DedupePlugin` would force `require` to serve only one instance of
each requested module.

Just add `SingleModuleInstancePlugin` instance to `webpack.config.js`:

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
