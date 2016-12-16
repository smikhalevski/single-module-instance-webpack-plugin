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
  /*
   * Sanitize the source by ignoring webpack require calls:
   * Say modules 1 & 2 are duplicates of module A
   *     modules 3 & 4 are duplicates of module B
   * If module A uses require("B")
   *    module 1 might contain __webpack_require__(3)
   *    module 2 might contain __webpack_require__(4)
   * Stripping the module ids from webpack_require allows to dedupe module 1 and 2.
   */
   return text.replace(/__webpack_require__\(\d+\)/g,"");
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
