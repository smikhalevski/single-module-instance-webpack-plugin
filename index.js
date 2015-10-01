function SingleModuleInstancePlugin() {}
module.exports = SingleModuleInstancePlugin;

SingleModuleInstancePlugin.prototype.apply = function(compiler) {
  compiler.plugin('compilation', function(compilation) {
    compilation.mainTemplate.plugin('require', function(source, chunk, hash) {

      return '  if (installedModules[moduleId]) {'
             + '  return installedModules[moduleId].exports;'
             + '}'
             + 'console.log("Requested module", moduleId);'
             + 'for (var id in modules) {'
             + '  if (Object.prototype.hasOwnProperty.call(modules, id)) {'
             + '    if (modules[id] === modules[moduleId] && installedModules[id]) {'
             + '      if (id !== moduleId) console.log("\tCopy of", id, "is returned!");'
             + '      return installedModules[id].exports;'
             + '    }'
             + '  }'
             + '}'
             + source;
    });
  });
};
