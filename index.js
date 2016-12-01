module.exports = SingleModuleInstancePlugin;

function SingleModuleInstancePlugin() {}


/*
  Sanitize string strips away the injected webpack header and footer stanzas that
  are subject to change.

  It does this by first checking for react hot loader in the header,
  and then the footer. If HMR is found in both, then it grabs the inner
  module text.

 */
function sanitizeString(text) {
   var length = text.length;
   if (length < 400) return text;
   var firstReactHotLoader = text.substr(0,200).indexOf("REACT HOT LOADER");
   if (firstReactHotLoader == -1) return text;

   var lastReactHotLoader = text.substr(length - 800, 100).lastIndexOf("REACT HOT LOADER");
   if (lastReactHotLoader == -1) return text;
   lastReactHotLoader += length - 800;

   var firstNewLine = text.indexOf("\n", firstReactHotLoader);
   return text.substr(firstNewLine, lastReactHotLoader - firstNewLine);
}

SingleModuleInstancePlugin.prototype.apply = function(compiler) {
  compiler.plugin('compilation', function(compilation) {
    compilation.mainTemplate.plugin('require', function(originalSource) {
      return this.asString([
        '// SingleModuleInstancePlugin',
        `${sanitizeString}`,
        'if (!installedModules[moduleId]) {',
        this.indent([
          'var source = String(modules[moduleId]);',
          'for (var id in modules) {',
          this.indent([
            'if (id !== moduleId && installedModules[id] && sanitizeString(String(modules[id])) === sanitizeString(source)) {',
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
