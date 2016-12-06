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

function getModuleBody(id) {
  if (smpCache.hasOwnProperty(id)) {
    return smpCache[id];
  }

  const body = sanitizeString(String(modules[id]));
  smpCache[id] = body;
  return body;
}

SingleModuleInstancePlugin.prototype.apply = function(compiler) {
  compiler.plugin('compilation', function(compilation) {
    compilation.mainTemplate.plugin('require', function(originalSource) {
      return this.asString([
        '// SingleModuleInstancePlugin',
        'const smpCache = this.smpCache = this.smpCache || {};',
        'const smpMap = this.smpMap = this.smpMap || new Map();',
        `${sanitizeString}`,
        `${getModuleBody}`,
        'if (!installedModules[moduleId]) {',
        this.indent([
          'const body = getModuleBody(moduleId);',
          'if (smpMap.has(body)) {',
          this.indent([
            'installedModules[moduleId] = installedModules[smpMap.get(body)];',
          ]),
          '}',
          'else {',
          this.indent([
            'smpMap.set(body, moduleId)',
          ]),
          '}'
        ]),
        '}',
        originalSource
      ]);
    });
  });
};
