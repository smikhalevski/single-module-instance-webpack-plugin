module.exports = SingleModuleInstancePlugin;

function SingleModuleInstancePlugin() {}

SingleModuleInstancePlugin.prototype.apply = function(compiler) {
  compiler.plugin('compilation', function(compilation) {
    compilation.mainTemplate.plugin('require', function(source) {
      return 'if (!installedModules[moduleId]) {'
             + '  var sourceCode = String(modules[moduleId]);'
             + '  for (var id in modules) {'
             + '    if (id !== moduleId && installedModules[id] && String(modules[id]) === sourceCode) {'
             + '      installedModules[moduleId] = installedModules[id];'
             + '      break;'
             + '    }'
             + '  }'
             + '}'
             + source;
    });
  });
};
