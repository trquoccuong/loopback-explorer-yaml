const fs = require('fs');
const glob = require('glob');
const YAML = require('yaml-js');
const extendify = require('extendify');

module.exports = function extractYAML(loopbackSwagger, pattern) {
  const oldGenerate = loopbackSwagger.generateSwaggerSpec;

  loopbackSwagger.generateSwaggerSpec = function () {
    try {
      const defaultData = oldGenerate.apply(this, arguments);
      const files = glob.sync(pattern);
      const contents = files.map(function (file) {
        return YAML.load(fs.readFileSync(file).toString());
      });
      const extend = extendify({
        inPlace: false,
        isDeep: true
      });
      contents.unshift(defaultData);
      return contents.reduce(extend);
    } catch (err) {
      throw err;
    }
  }
};