const path = require('path');

module.exports = (storybookBaseConfig, configType) => {
  if (configType === 'PRODUCTION') {
    // Removing uglification until we figure out a fix for that.
    storybookBaseConfig.plugins.pop();
  }
  return storybookBaseConfig;
};
