const fs = require('fs');
const glob = require('glob');
const YAML = require('yaml-js');
const extendify = require('extendify');

module.exports = function extractYAML(loopbackSwagger, pattern) {
  const oldGenerate = loopbackSwagger.generateSwaggerSpec;

  loopbackSwagger.generateSwaggerSpec = function () {
    console.log('demo');
    try {
      const defaultData = oldGenerate.apply(this, arguments);
      const files = glob.sync(pattern);
      console.log(files);
      const contents = files.map(function (file) {
        return YAML.load(fs.readFileSync(file).toString());
      });
      const extend = extendify({
        inPlace: false,
        isDeep: true
      });
      contents.push(defaultData);
      return contents.reduce(extend);
    } catch (err) {
      throw err;
    }
  }
};