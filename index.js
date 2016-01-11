module.exports = SingleModuleInstancePlugin;

function SingleModuleInstancePlugin() {}

SingleModuleInstancePlugin.prototype.apply = function(compiler) {
  compiler.plugin('compilation', function(compilation) {
    compilation.mainTemplate.plugin('require', function(originalSource) {
      return this.asString([
        '// SingleModuleInstancePlugin',
        'if (!installedModules[moduleId]) {',
        this.indent([
          'var source = String(modules[moduleId]);',
          'for (var id in modules) {',
          this.indent([
            'if (id !== moduleId && installedModules[id] && String(modules[id]) === source) {',
            this.indent([
              'installedModules[moduleId] = installedModules[id];',
              'break;'
            ]),
            '}'
          ]),
          '}'
        ]),
        '}',
        originalSource
      ]);
    });
  });
};
