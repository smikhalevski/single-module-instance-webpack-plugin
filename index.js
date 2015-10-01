function SingleModuleInstancePlugin() {}
module.exports = SingleModuleInstancePlugin;

SingleModuleInstancePlugin.prototype.apply = function(compiler) {
  compiler.plugin('compilation', function(compilation) {
    compilation.mainTemplate.plugin('require', function(source, chunk, hash) {

      return '  if (installedModules[moduleId]) {'
             + '  return installedModules[moduleId].exports;'
             + '}'
             + 'for (var id in modules) {'
             + '  if (Object.prototype.hasOwnProperty.call(modules, id)) {'
             + '    if (modules[id] === modules[moduleId] && installedModules[id]) {'
             + '      return installedModules[id].exports;'
             + '    }'
             + '  }'
             + '}'
             + source;
    });
  });
};
